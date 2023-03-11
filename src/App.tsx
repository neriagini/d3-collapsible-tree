import React from 'react';
import Tree from "./components/Tree";
import { v4 as uuidv4 } from 'uuid';

const DATA = {
  name: 'Prduction Line 1',
  id: 'productionLine1',
  collapse: false,
  children: [
    {
      name: 'Batching',
      id: 'batching',
      collapse: false,
      children: [],
    },
    {
      name: 'Blending',
      id: 'blending',
      collapse: false,
      children: [
        {
          name: 'DataField',
          id: 'blending-datafield',
          collapse: false,
          children: [],
        },
        {
          name: 'DataSchema',
          id: 'blending-dataschema',
          collapse: false,
          children: [],
        },
        {
          name: 'Dataset',
          id: 'blending-dataset',
          collapse: false,
          children: [],
        },
        {
          name: 'DataSource',
          id: 'blending-datasource',
          collapse: false,
          children: [],
        },
        {
          name: 'DataTable',
          id:'blending-datatable',
          collapse: false,
          children: [],
        },
        {
          name: 'DataUtil',
          id: 'blending-datautil',
          collapse: false,
          children: [],
        },
      ],
    },
    {
      name: 'Formax 1',
      id: 'formax1',
      collapse: false,
      children: [
        {
          name: 'DataField',
          id: 'formax1-datafield',
          collapse: false,
          children: [],
        },
        {
          name: 'DataSchema',
          id: 'formax1-dataschema',
          collapse: false,
          children: [],
        },
        {
          name: 'Dataset',
          id: 'formax1-dataset',
          collapse: false,
          children: [],
        },
        {
          name: 'DataSource',
          id: 'formax1-datasource',
          collapse: false,
          children: [],
        },
        {
          name: 'DataTable',
          id: 'formax1-datatable',
          collapse: false,
          children: [],
        },
        {
          name: 'DataUtil',
          id: 'formax1-datautil',
          collapse: false,
          children: [],
        },
      ],
    },
    {
      name: 'Formax 2',
      id: 'formax2',
      collapse: false,
      children: [
        {
          name: 'DataField',
          id: 'formax2-datafield',
          collapse: false,
          children: [],
        },
        {
          name: 'DataSchema',
          id: 'formax2-dataschema',
          collapse: false,
          children: [],
        },
        {
          name: 'Dataset',
          id: 'formax2-dataset',
          collapse: false,
          children: [],
        },
        {
          name: 'DataSource',
          id: 'formax2-datasource',
          collapse: false,
          children: [],
        },
        {
          name: 'DataField',
          id: 'formax2-datafield',
          collapse: false,
          children: [],
        },
        {
          name: 'DataSchema',
          id: 'formax2-dataschema',
          collapse: false,
          children: [],
        },
        {
          name: 'Dataset',
          id: 'formax2-dataset',
          collapse: false,
          children: [],
        },
        {
          name: 'DataSource',
          id: 'formax2-datasource',
          collapse: false,
          children: [],
        },
        {
          name: 'DataField',
          id: 'formax2-DataField-child',
          collapse: false,
          children: [
            {
              name: 'DataField',
              id: 'formax2-DataField-csdvs',
              collapse: false,
              children: [],
            },
            {
              name: 'DataSchema',
              id: 'formax2-DataField-grgdf',
              collapse: false,
              children: [],
            },
            {
              name: 'Dataset',
              id: 'formax2-DataField-4tgd',
              collapse: false,
              children: [],
            },
            {
              name: 'DataSource',
              id: 'formax2-DataField-vdvsv',
              collapse: false,
              children: [],
            },
          ],
        },
        {
          name: 'Dataset',
          id: uuidv4(),
          collapse: false,
          children: [
            {
              name: 'DataField',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'DataSchema',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'Dataset',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'DataSource',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'DataField',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'DataSchema',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'Dataset',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'DataSource',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'DataField',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'DataSchema',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'Dataset',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'DataSource',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'DataField',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'DataSchema',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'Dataset',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
            {
              name: 'DataSource',
              id: uuidv4(),
              collapse: false,
              children: [],
            },
          ],
        },
        {
          name: 'DataSource',
          id: uuidv4(),
          collapse: false,
          children: [],
        },
      ],
    },
    {
      name: 'Formax 3',
      id: uuidv4(),
      collapse: false,
      children: [],
    },
    {
      name: 'Formax 4',
      id: uuidv4(),
      collapse: false,
      children: [],
    },
    {
      name: 'Frigo 1',
      id: uuidv4(),
      collapse: false,
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
      collapse: false,
      children: [],
    },
    {
      name: 'Pack Off',
      id: uuidv4(),
      collapse: false,
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
