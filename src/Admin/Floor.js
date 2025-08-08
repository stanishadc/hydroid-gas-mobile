import React from 'react';
import Unit from './Unit';
import { Tree, TreeNode } from 'react-organizational-chart';
const Floor = ({ floor }) => {
  return (
      <TreeNode label={<div>{floor.floorName}</div>}>
      {floor.units.length > 0 && floor.units.map((unit, index) => (
        <Unit key={index} unit={unit} />
      ))}
    </TreeNode>
  );
};

export default Floor;
