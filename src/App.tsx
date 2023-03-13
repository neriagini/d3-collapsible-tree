import React from 'react';
import Tree from "./components/Tree";
import { v4 as uuidv4 } from 'uuid';

const DATA = {
  name: 'Prduction Line 1',
  id: 'productionLine1',
  children: [
    {
      name: 'Batching',
      id: 'batching',
      children: [],
    },
    {
      name: 'Blending',
      id: 'blending',
      children: [],
    },
    {
      name: 'Formax 1',
      id: 'formax1',
      children: [],
    },
    {
      name: 'Formax 2',
      id: 'formax2',
      children: [
        {
          name: 'Overheads',
          id: uuidv4(),
          children: [
            {
              name: 'DataTable',
              id: uuidv4(),
              children: [
                {
                  name: 'Overheads',
                  id: uuidv4(),
                  children: [
                    {
                      name: 'DataTable',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Plates / Knives',
                      children:[],
                      id: uuidv4(),
                    },
                    {
                      name: 'Combo Bin Hoist 1',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Combo Bin Hoist 2',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Hooks At Batching',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Batching Tools',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Bin Hoist Rework',
                      id: uuidv4(),
                      children: [],
                    },
                  ],
                },
                {
                  name: 'General Area',
                  id: uuidv4(),
                  children: [
                    {
                      name: 'Batching Work Station',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Batching Work Stand Entrance',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Batching Hand Wash',
                      id: uuidv4(),
                      children: [],
                    },
                  ],
                },
                {
                  name: 'Conveyor',
                  id: uuidv4(),
                  children: [
                    {
                      name: 'Batching Work Station',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Batching Work Stand Entrance',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Batching Hand Wash',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'DataTable',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Plates / Knives',
                      children:[],
                      id: uuidv4(),
                    },
                    {
                      name: 'Combo Bin Hoist 1',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Combo Bin Hoist 2',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Hooks At Batching',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Batching Tools',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Bin Hoist Rework',
                      id: uuidv4(),
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              name: 'Plates / Knives',
              children:[],
              id: uuidv4(),
            },
            {
              name: 'Combo Bin Hoist 1',
              id: uuidv4(),
              children: [],
            },
            {
              name: 'Combo Bin Hoist 2',
              id: uuidv4(),
              children: [
                {
                  name: 'Overheads',
                  id: uuidv4(),
                  children: [
                    {
                      name: 'DataTable',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Plates / Knives',
                      children:[],
                      id: uuidv4(),
                    },
                    {
                      name: 'Combo Bin Hoist 1',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Combo Bin Hoist 2',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Hooks At Batching',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Batching Tools',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Bin Hoist Rework',
                      id: uuidv4(),
                      children: [],
                    },
                  ],
                },
                {
                  name: 'General Area',
                  id: uuidv4(),
                  children: [
                    {
                      name: 'Batching Work Station',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Batching Work Stand Entrance',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Batching Hand Wash',
                      id: uuidv4(),
                      children: [],
                    },
                  ],
                },
                {
                  name: 'Conveyor',
                  id: uuidv4(),
                  children: [
                    {
                      name: 'Batching Work Station',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Batching Work Stand Entrance',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Batching Hand Wash',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'DataTable',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Plates / Knives',
                      children:[],
                      id: uuidv4(),
                    },
                    {
                      name: 'Combo Bin Hoist 1',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Combo Bin Hoist 2',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Hooks At Batching',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Batching Tools',
                      id: uuidv4(),
                      children: [],
                    },
                    {
                      name: 'Bin Hoist Rework',
                      id: uuidv4(),
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              name: 'Hooks At Batching',
              id: uuidv4(),
              children: [],
            },
            {
              name: 'Batching Tools',
              id: uuidv4(),
              children: [],
            },
            {
              name: 'Bin Hoist Rework',
              id: uuidv4(),
              children: [],
            },
          ],
        },
        {
          name: 'General Area',
          id: uuidv4(),
          children: [
            {
              name: 'Batching Work Station',
              id: uuidv4(),
              children: [],
            },
            {
              name: 'Batching Work Stand Entrance',
              id: uuidv4(),
              children: [],
            },
            {
              name: 'Batching Hand Wash',
              id: uuidv4(),
              children: [],
            },
          ],
        },
        {
          name: 'Conveyor',
          id: uuidv4(),
          children: [
            {
              name: 'Batching Work Station',
              id: uuidv4(),
              children: [],
            },
            {
              name: 'Batching Work Stand Entrance',
              id: uuidv4(),
              children: [],
            },
            {
              name: 'Batching Hand Wash',
              id: uuidv4(),
              children: [],
            },
            {
              name: 'DataTable',
              id: uuidv4(),
              children: [],
            },
            {
              name: 'Plates / Knives',
              children:[],
              id: uuidv4(),
            },
            {
              name: 'Combo Bin Hoist 1',
              id: uuidv4(),
              children: [],
            },
            {
              name: 'Combo Bin Hoist 2',
              id: uuidv4(),
              children: [],
            },
            {
              name: 'Hooks At Batching',
              id: uuidv4(),
              children: [],
            },
            {
              name: 'Batching Tools',
              id: uuidv4(),
              children: [],
            },
            {
              name: 'Bin Hoist Rework',
              id: uuidv4(),
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'Formax 3',
      id: uuidv4(),
      children: [],
    },
    {
      name: 'Formax 4',
      id: uuidv4(),
      children: [],
    },
    {
      name: 'Frigo 1',
      id: uuidv4(),
      children: [
        {
          name: 'Overheads',
          id: uuidv4(),
          collapse: false,
          children: [
            {
              name: 'Batching Work Station',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'Batching Work Stand Entrance',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'Batching Hand Wash',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'DataTable',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'Plates / Knives',
              children:[],
              id: uuidv4(),
              collapse: false,
            },
            {
              name: 'Combo Bin Hoist 1',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'Combo Bin Hoist 2',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'Hooks At Batching',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'Batching Tools',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'Bin Hoist Rework',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'Frigo 2',
      id: uuidv4(),
      children: [
        {
          name: 'Bin Hoist Rework',
          id: uuidv4(),
          collapse: false,
          children: [],
        },
        {
          name: 'Bin Hoist Rework',
          id: uuidv4(),
          collapse: false,
          children: [],
        },
        {
          name: 'Bin Hoist Rework',
          id: uuidv4(),
          collapse: false,
          children: [],
        },
        {
          name: 'Bin Hoist Rework',
          id: uuidv4(),
          collapse: false,
          children: [],
        },
        {
          name: 'Bin Hoist Rework',
          id: uuidv4(),
          collapse: false,
          children: [],
        },
        {
          name: 'Bin Hoist Rework',
          id: uuidv4(),
          collapse: false,
          children: [],
        },
        {
          name: 'Bin Hoist Rework',
          id: uuidv4(),
          collapse: false,
          children: [],
        },
        {
          name: 'Bin Hoist Rework',
          id: uuidv4(),
          collapse: false,
          children: [],
        },
        {
          name: 'Bin Hoist Rework',
          id: uuidv4(),
          collapse: false,
          children: [],
        },
        {
          name: 'Bin Hoist Rework',
          id: uuidv4(),
          collapse: false,
          children: [],
        },
        {
          name: 'Bin Hoist Rework',
          id: uuidv4(),
          collapse: false,
          children: [],
        },
      ],
    },
    {
      name: 'Pack Off',
      id: uuidv4(),
      children: [],
    },
  ]
}
function App() {
  return (
    <div style={{height: '100vh', width:'100wh'}}>
      <Tree data={DATA} />
    </div>
  );
}

export default App;
