import { Children } from "react";

export const items = [
  {
    title: 'Body',
    icon: 'body.svg',
  
  },
  {
    title: 'Collar',
    icon: 'collar.svg',
  },
  {
    title: 'Buttons',
    icon: 'button.svg',
  },
  {
    title: 'Sleeve',
    icon: 'sleeve.svg',
   
  },
  
];
const clothMaterials = [
  {
    title: 'material_1',
    texture: 'material_1.jpg',
    price : 10,
  },
  {
    title: 'material_2',
    texture: 'material_2.jpg',  
    price : 15,
  },
  {
    title: 'material_3',
    texture: 'material_3.jpg',
    price : 20,
  },
  {
    title: 'material_4',
    texture: 'material_4.jpg',
    price : 25,
  },
  {
    title: 'material_5',
    texture: 'material_5.jpg',
    price : 30,
  },
  {
    title: 'material_6',
    texture: 'material_6.jpg',
    price : 35,
  },
  {
    title: 'material_7',
    texture: 'material_7.jpg',
    price : 40,
  }, 
]

const buttonMaterials = [
  {
    title: 'buttonMaterial_1',
    texture: 'buttonM_1.jpg',
    price : 10,
  },
  {
    title :'buttonMaterial_2',
    texture: 'buttonM_2.jpg',
    price : 15,
  },
  {
    title: 'buttonMaterial_3',
    texture: 'buttonM_3.jpg',
    price : 20,
  },
  {
    title: 'buttonMaterial_4',
    texture: 'buttonM_4.jpg',
    price : 15,
  },
]

const clothColors = [
  {
    title: 'default_1',
    texture: 'default_1.jpg',
    price : 10,
  },
  {
    title: 'default_2',
    texture: 'default_2.jpg',
    price : 15,
  },
  {
    title: 'default_3',
    texture: 'default_3.jpg',
    price : 20,
  },
  {
    title: 'default_4',
    texture: 'default_4.jpg',
    price : 25,
  },
  {
    title: 'default_5',
    texture: 'default_5.jpg', 
    price : 30,
  },
  {
    title: 'default_6',
    texture: 'default_6.jpg',
    price : 35,
  },
  {
    title: 'default_7',
    texture: 'default_7.jpg',
    price : 40,
  },
  {
    title: 'default_8',
    texture: 'default_8.jpg',
    price : 45,
  },
  {
    title: 'default_9',
    texture: 'default_9.jpg',
    price : 50,
  },
  {
    title: 'default_10',
    texture: 'default_10.jpg',  
    price : 55,
  },
  {
    title: 'default_11',
    texture: 'default_11.jpg',
    price : 60,
  },
  {
    title: 'default_12',
    texture: 'default_12.jpg',
    price : 65,
  },
]

const buttonColors = [
    {
      title: 'default_1',
      texture: 'default_1.jpg',
      material : 3,
      price : 1,
    },
    {
      title: 'default_2',
      texture: 'default_2.jpg',
      material : 3,
      price : 1.5,
    },
    {
      title: 'default_3',
      texture: 'default_3.jpg',
      material : 3,
      price : 2.0,
    },
    {
      title: 'default_4',
      texture: 'default_4.jpg',
      material : 3,
      price : 2.0,
    },
    {
      title: 'default_5',
      texture: 'default_5.jpg', 
      material : 3,
      price : 2.0,
    },
    {
      title: 'default_6',
      texture: 'default_6.jpg',
      material : 3,
      price : 2.0,
    },
    {
      title: 'default_7',
      texture: 'default_7.jpg',
      material : 3,
      price : 1.0,
    },
    {
      title: 'default_8',
      texture: 'default_8.jpg',
      material : 3,
      price : 1.0,
    },
    {
      title: 'default_9',
      texture: 'default_9.jpg',
      material : 3,
      price : 1.0,
    },
    {
      title: 'default_10',
      texture: 'default_10.jpg',  
      material : 3,
      price : 1.0,
    },
    {
      title: 'default_11',
      texture: 'default_11.jpg',
      material : 3,
      price : 1.0,
    },
    {
      title: 'default_12',
      texture: 'default_12.jpg',
      material : 3,
      price : 1.0,
    },
    {
      title : 'default_13',
      texture: 'default_13.jpg',
      material : 2,
      price : 1.0,
    },
    {
      title : 'default_14',
      texture: 'default_14.jpg',
      material : 2,
      price : 1.0,
    },
    {
      title : 'default_15',
      texture: 'default_15.jpg',
      material : 2,
      price : 1.0,
    },
    {
      title : 'default_16',
      texture: 'default_16.jpg',
      material : 0,
      price : 1.0,
    },
    {
      title : 'default_17',
      texture: 'default_17.jpg',
      material : 0,
      price : 1.0,
    },
    {
      title : 'default_18',
      texture: 'default_18.jpg',
      material : 1,
      price : 2.0,
    },
    {
      title : 'default_19',
      texture: 'default_19.jpg',
      material : 1,
      price : 2.0,
    },
    {
      title : 'default_20',
      texture: 'default_20.jpg',
      material : 1,
      price : 2.0,
    },
]
export const STEPS = [
  {
    title: 'Type',
    subtitle : 'Select your type',
    children : [
      [
        {
          title: 'body_1',
          texture: 'body_1.jpg',
          price : 100,
        },
        {
          title: 'body_2',
          texture: 'body_2.jpg',
          price : 200,
        },
      ],
      [
        {
          title : 'collar_1',
          texture: 'collar_1.jpg',
          price : 10,
        },
        {
          title : 'collar_2',
          texture: 'collar_2.jpg',
          price : 15,
        },
        {
          title : 'collar_3',
          texture: 'collar_3.jpg',
          price : 20,
        },
        {
          title : 'collar_4',
          texture: 'collar_4.jpg',
          price : 25,
        },
        {
          title : 'collar_5',
          texture: 'collar_5.jpg',
          price : 30,
        },
      ],
      [
        {
          title: 'buttons_1',
          texture: 'button_1.jpg',
          price : 0,
        },
        {
          title: 'buttons_2',
          texture: 'button_2.jpg',
          price : 1,
        },
        {
          title: 'buttons_3',
          texture: 'button_3.jpg',
          price : 1.5,
        },
        {
          title: 'buttons_4',
          texture: 'button_4.jpg',
          price : 1,
        },
      ],
      [
        
          {
            title: 'sleeve_1',
            texture: 'sleeve_1.jpg',
            price : 5,
          },
          {
            title: 'sleeve_2',
            texture: 'sleeve_2.jpg',
            price : 10,
          },
      ],
    ]
  },

  {
    title: 'Materials',
    subtitle : 'Select your materials',
    children : [
      clothMaterials,
      clothMaterials,
      buttonMaterials,
      clothMaterials
    ]
  },
  {
    title: 'Colors',
    subtitle : 'Select your colors',
    children : [
      clothColors,
      clothColors,
      buttonColors,
      clothColors
    ]
  },

]
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

