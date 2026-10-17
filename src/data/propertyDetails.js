export const makeGallery = (seed, count) =>
  Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${seed}-${i + 1}/1600/1100`)

export const fallbackDescription = [
  'Description coming soon. Replace this text with the listing description.',
]

export const details = {
  441841: {
    location: 'Lidcombe',
    description: [
      'Modern 1-bedroom with Accor Stadium views. Enjoy sweeping stadium views from this stylish apartment in the heart of Sydney Olympic Park. Featuring open-plan living, a full kitchen',
      'Placeholder: replace this paragraph with the rest of the listing description from the client.',
    ],
    gallery: makeGallery('accorview', 29),
    amenityGroups: [
      { title: 'General', items: ['Swimming pool', 'Gym', 'Essentials', 'Free parking', 'Suitable for children', 'Suitable for infants'] },
      { title: 'Tech & Comfort', items: ['Internet', 'Wireless', 'Air conditioning', 'Elevator', 'Heating', 'TV'] },
      { title: 'Kitchen', items: ['Kitchen', 'Toaster', 'Dishwasher', 'Microwave', 'Oven', 'Electric kettle'] },
      { title: 'Bedroom', items: ['Hangers', 'Iron', 'Linens', 'Clothing storage', 'Drying rack for clothing'] },
      { title: 'Bathroom', items: ['Hair Dryer', 'Shampoo', 'Hot water', 'Body soap', 'Conditioner', 'Shower gel'] },
      { title: 'Laundry', items: ['Washing Machine', 'Dryer', 'Cleaning products'] },
      { title: 'Safety', items: ['Smoke detector', 'First aid kit', 'Fire Extinguisher'] },
      { title: 'Extras', items: ['Dining table', 'Outdoor furniture', 'Board games'] },
      { title: 'Policies', items: ['Private entrance', 'Long term stays allowed', 'Cleaning before checkout'] },
    ],
  },
}