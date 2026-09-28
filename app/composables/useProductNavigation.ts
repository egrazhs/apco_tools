import { useAsyncData } from '#app';
import { useSupabaseClient } from '#supabase/server';

export const useProductNavigation = () => {
    const supabase = useSupabaseClient();

    /**
     * Get groupings for a category
     * Returns [] if no groupings exist (direct to subcategories)
     */
    const getGroupings = async (categoryId: number) => {
        const { data, error } = await supabase
            .from('category_groupings')
            .select('*')
            .eq('category_id', categoryId)
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data || [];
    };

    /**
     * Get subcategories directly from a category
     * (Without intermediate grouping)
     */
    const getSubcategoriesByCategory = async (categoryId: number) => {
        const { data, error } = await supabase
            .from('subcategories')
            .select('*')
            .eq('category_id', categoryId)
            .is('grouping_id', null)  // Sin agrupación
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    };

    /**
     * Get subcategories from a specific grouping
     */
    const getSubcategoriesByGrouping = async (groupingId: number) => {
        const { data, error } = await supabase
            .from('subcategories')
            .select('*')
            .eq('grouping_id', groupingId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    };

    /**
     * Get products from a subcategory
     * (No changes from current implementation)
     */
    const getProductsBySubcategory = async (subcategoryId: number) => {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                product_subcategories (
                    subcategory_id
                )
            `)
            .eq('product_subcategories.subcategory_id', subcategoryId)
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    };

    return {
        getGroupings,
        getSubcategoriesByCategory,
        getSubcategoriesByGrouping,
        getProductsBySubcategory,
    };
};