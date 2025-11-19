export const STEPS = [
  {
    title: 'Body',
    icon: 'body.svg',
    children: [
      {
        id: 0,
        title: 'Normal',
        value: 'normal',
        description: 'Basic watch without pushers',
        price: 0,
      },
      {
        id: 1,
        title: 'Auto',
        value: 'auto',
        description: 'Automatic watch without crown',
        price: 1350,
      },
      {
        id: 2,
        title: 'Second Hand',
        value: 'chronograph',
        description: 'Chronograph with sub-dials',
        price: 250,
      },
    ],
  },
  {
    title: 'Collar',
    icon: 'collar.svg',
    children: [
      {
        id: 0,
        title: 'Silver',
        texture: 'silver.jpg',
        metalness: 0.9,
        roughness: 0.1,
        price: 300,
      },
      {
        id: 1,
        title: 'Gold',
        texture: 'gold.png',
        metalness: 0.95,
        roughness: 0.05,
        price: 500,
      },
      {
        id: 2,
        title: 'Titanium',
        texture: 'titanium.jpg',
        metalness: 0.85,
        roughness: 0.2,
        price: 250,
      },
      {
        id: 3,
        title: 'Iron',
        texture: 'iron.jpg',
        metalness: 0.8,
        roughness: 0.3,
        price: 100,
      },
    ],
  },
  {
    title: 'Buttons',
    icon: 'button.svg',
    children: [
      {
        title: 'Strap',
        meshName: 'Strap',
        color: [
          {
            title: 'Greymetal',
            texture: 'greymetal.jpg',
            price: 0, 
          },
          {
            title: 'Grey',
            texture: 'grey.png',
            price: 25,
          },
          {
            title: 'Silver',
            texture: 'silver.jpg',
            price: 250,
          },
          {
            title: 'Gold',
            texture: 'gold.png',
            price: 750,
          },
          {
            title: 'Black',
            texture: 'iron.jpg',
            price: 30,
          },
          {title: 'Titanium',
            texture: 'titanium.jpg',
            price: 160,
          },
        ] 
      },
      {
        title: 'Internal Display',
        meshName: 'Internal_Display',
        color: [
          {
            title: 'Black',
            texture: 'blackinternal.jpg',
            price: 0,
          },
          {
            title: 'Grey',
            texture: 'grey.png',
            price: 100,
          },
          {
            title: 'Silver',
            texture: 'silver.jpg',
            price: 150,
          },
          {
            title: 'Gold',
            texture: 'gold.png',
            price: 250,
          },
        ]

      },
      {
        title: 'Watch Base',
        meshName: 'Watch_Base',
        color: [
          {
            title: 'Black',
            texture: 'iron.jpg',
            price: 0,
          },
          {
            title: 'Greymetal',
            texture: 'greymetal.jpg',
            metalness: 0.2,
            roughness: 0.7,
            price: 50,
          },
          {
            title: 'Grey',
            texture: 'grey.png',
            metalness: 0.2,
            roughness: 0.7,
            price: 35,
          },
          {
            title: 'Silver',
            texture: 'silver.jpg',
            metalness: 0.2,
            roughness: 0.7,
            price: 350,
          },
          {
            title: 'Gold',
            texture: 'gold.png',
            metalness: 0.2,
            roughness: 0.7,
            price: 800,
          },
          
          {title: 'Titanium',
            texture: 'titanium.jpg',
            price: 270,
          },
        ]
      }
    ],
  },
  {
    title: 'Sleeve',
    icon: 'sleeve.svg',
    children: [
      {
        id: 0,
        title: 'Silver',
        texture: 'silver.jpg',
        metalness: 0.9,
        roughness: 0.1,
        price: 300,
      },
      {
        id: 1,
        title: 'Gold',
        texture: 'gold.png',
        metalness: 0.95,
        roughness: 0.05,
        price: 500,
      },
      {
        id: 2,
        title: 'Titanium',
        texture: 'titanium.jpg',
        metalness: 0.85,
        roughness: 0.2,
        price: 250,
      },
      {
        id: 3,
        title: 'Iron',
        texture: 'iron.jpg',
        metalness: 0.8,
        roughness: 0.3,
        price: 100,
      },
    ],
  },
  
];

export const NavTools = [
  {
    id: 1,
    title: 'Previous',
    icon: 'prev.svg',
  },
  {
    id: 2,
    title: 'Next',
    icon: 'next.svg',
  },
  {
    id: 3,
    title: 'upload',
    icon: 'upload.svg',
  },
  {
    id: 4,
    title: 'text',
    icon: 'text.svg',
  },
  {
    id: 5,
    title: 'Save',
    icon: 'save.svg',
  },
  {
    id: 6,
    title: 'rotate',
    icon: 'rotate.svg',
  }
];