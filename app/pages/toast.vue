<script setup lang="ts">
const toast = useToast()

definePageMeta({
  layout: false
})

function addToCalendar() {
  const eventDate = new Date(Date.now() + Math.random() * 31536000000)
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  console.log("Aqui deberia mostrar el toast", toast);

  toast.add({
    title: 'Event added to calendar',
    description: `This event is scheduled for ${formattedDate}.`,
    icon: 'i-lucide-calendar-days'
  })
}
</script>

<template>
  <UButton
    label="Add to calendar"
    color="neutral"
    variant="outline"
    icon="i-lucide-plus"
    @click="addToCalendar"
    class="cursor-pointer"
  />
</template>
