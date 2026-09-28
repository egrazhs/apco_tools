# Implementación: Categorías con Niveles Intermedios (Agrupaciones)

## 📋 Descripción General

Este documento explica cómo implementar un sistema de navegación multinivel para productos:
**Categoría → Agrupación (opcional) → Subcategoría → Productos**

Las agrupaciones son un nivel intermedio **opcional**. Categorías sin agrupaciones van directamente a subcategorías.

---

## 🗄️ Estructura de Base de Datos

### 1. Tabla `category_groupings` (nueva)

```sql
CREATE TABLE categor||y_groupings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    image_key VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(category_id, slug)
);

CREATE INDEX idx_category_groupings_category ON category_groupings(category_id);
CREATE INDEX idx_category_groupings_slug ON category_groupings(slug);
```

### 2. Modificación a `subcategories`

```sql
ALTER TABLE subcategories 
ADD COLUMN grouping_id BIGINT REFERENCES category_groupings(id) ON DELETE SET NULL;

CREATE INDEX idx_subcategories_grouping ON subcategories(grouping_id);
```

### 3. Row Level Security (RLS)

```sql
ALTER TABLE category_groupings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view category_groupings"
ON category_groupings
FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage category_groupings"
ON category_groupings
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
        AND profiles.is_active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
        AND profiles.is_active = true
    )
);
```

---

## 🔧 Composables

### useGroupings.ts (NUEVO)

```typescript
export const useGroupings = () => {
    const supabase = useSupabaseClient()

    const getGroupingsByCategory = async (categoryId: number) => {
        const { data, error } = await supabase
            .from('category_groupings')
            .select('*')
            .eq('category_id', categoryId)
            .order('display_order', { ascending: true })

        if (error) throw error
        return { data: data || [] }
    }

    return { getGroupingsByCategory }
}
```

### useSubcategories.ts (ACTUALIZAR)

Agregar estos dos métodos:

```typescript
/**
 * Get subcategories directly from a category (sin agrupación)
 */
const getSubcategoriesByCategory = async (categoryId: number) => {
    const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('category_id', categoryId)
        .is('grouping_id', null)
        .order('created_at', { ascending: true })

    if (error) throw error
    return { data: data || [] }
}

/**
 * Get subcategories from a specific grouping
 */
const getSubcategoriesByGrouping = async (groupingId: number) => {
    const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('grouping_id', groupingId)
        .order('created_at', { ascending: true })

    if (error) throw error
    return { data: data || [] }
}

return { 
    getSubcategoriesByCategory,
    getSubcategoriesByGrouping 
}
```

### useCategories.ts (ACTUALIZAR)

```typescript
/**
 * Get active categories with products
 * Muestra categorías que tengan al menos un producto en sus subcategorías
 */
const getActiveCategories = async (brandId: string) => {
    if (!brandId) throw new Error('Brand ID requerido')
    
    // Obtener todas las categorías activas
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, name, slug, is_active, brand_id, created_at, image_key')
        .eq('brand_id', brandId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
    
    if (catError) return { data: null, error: catError }
    if (!categories?.length) return { data: [], error: null }

    // Obtener subcategorías
    const { data: subcategories, error: subError } = await supabase
        .from('subcategories')
        .select('id, category_id, name')
        .in('category_id', categories.map(c => c.id))
    
    if (subError) return { data: null, error: subError }

    // Obtener productos en subcategorías
    const subcategoryIds = subcategories?.map(s => s.id) || []
    if (subcategoryIds.length === 0) return { data: [], error: null }

    const { data: productSubcategories, error: psError } = await supabase
        .from('product_subcategories')
        .select('subcategory_id, products(id, is_active)')
        .in('subcategory_id', subcategoryIds)
    
    if (psError) return { data: null, error: psError }

    // Filtrar: categorías con productos activos
    const subcategoryIdsWithProducts = new Set(
        (productSubcategories || [])
            .filter(ps => ps.products?.is_active === true)
            .map(ps => ps.subcategory_id)
    )

    const categoryIdsWithProducts = new Set(
        (subcategories || [])
            .filter(sub => subcategoryIdsWithProducts.has(sub.id))
            .map(sub => sub.category_id)
    )

    const categoriesWithProducts = (categories || []).filter(cat =>
        categoryIdsWithProducts.has(cat.id)
    )

    return { 
        data: mapCategoriesWithImages(categoriesWithProducts), 
        error: null 
    }
}
```

---

## 📄 Componente de Categoría

**Archivo:** `pages/catalogo/[marca]/[category_slug].vue`

El componente detecta automáticamente:
1. Si la categoría tiene agrupaciones → muestra agrupaciones
2. Si no → muestra subcategorías directas

**Query params:**
- `?grouping=slug&sub=slug` → Flujo completo
- `?sub=slug` → Sin agrupaciones

**Lógica detectora:**

```typescript
const paso = computed(() => {
    const { grouping, sub } = route.query
    
    if (groupings.value.length > 0 && !grouping) return 'groupings'
    return 'subcategories'
})
```

---

## 🎯 Casos de Uso

### Caso 1: Categoría SIN agrupaciones

/catalogo/ridgid/accesorios
↓ (detecta: no hay agrupaciones)
↓ muestra subcategorías directas
↓ ?sub=mangueras
↓ muestra productos


### Caso 2: Categoría CON agrupaciones

/catalogo/ridgid/roscadoras
↓ (detecta: hay agrupaciones)
↓ muestra ["Manual", "Eléctrica"]
↓ ?grouping=manual
↓ muestra subcategorías de "Manual"
↓ ?grouping=manual&sub=tarrajas
↓ muestra productos


---

## 🛠️ Paso a Paso: Crear Agrupaciones

### Desde la interfaz (CRUD futuro)

1. **Ir a admin → Categorías**
2. **Seleccionar categoría (ej: "Roscadoras")**
3. **Tab: "Agrupaciones"**
4. **Agregar:**
   - Nombre: "Manual"
   - Slug: "manual"
   - Descripción: "Herramientas manuales"
5. **Guardar**
6. **Ir a Subcategorías**
7. **Editar subcategoría → Asignar a Agrupación: "Manual"**
8. **Listo**

### Desde SQL (para pruebas)

```sql
-- 1. Crear agrupación
INSERT INTO category_groupings (category_id, name, slug, description, display_order)
VALUES (70, 'Manual', 'manual', 'Herramientas manuales', 1)
RETURNING id;  -- Obtén el ID

-- 2. Vincular subcategoría a la agrupación
UPDATE subcategories
SET grouping_id = 1  -- ID de la agrupación
WHERE id = 48;
```

---

## ⚠️ Notas Importantes

### Relaciones

| Columna | Tabla | Debe estar lleno | Obligatorio |
|---------|-------|------------------|-------------|
| `category_id` | subcategories | Siempre | ✅ Sí |
| `grouping_id` | subcategories | Solo si hay agrupación | ❌ No |

**La subcategoría siempre sabe su categoría padre (`category_id`), pero opcionalmente puede tener una agrupación.**

### Comportamiento automático

- **Categoría sin productos** → No aparece en listado
- **Categoría con agrupaciones** → Muestra agrupaciones primero
- **Categoría sin agrupaciones pero con subcategorías con productos** → Muestra subcategorías directas

---

## 🚀 Próximas Mejoras

### CRUD de Agrupaciones
Crear interfaz en admin para:
- Listar agrupaciones por categoría
- Crear/editar/eliminar agrupaciones
- Reordenar por `display_order`

### Subniveles (Opciones de Subcategoría)
Aplicar el mismo patrón:

Subcategoría → Opciones → Productos


---

## 📚 Referencias

- Tabla: `category_groupings`
- Relación: `subcategories.grouping_id`
- Composable: `useGroupings.ts`
- Componente: `pages/catalogo/[marca]/[category_slug].vue`