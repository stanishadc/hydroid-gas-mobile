import React from 'react';
import Floor from './Floor';
import { Tree, TreeNode } from 'react-organizational-chart';
const Block = ({ block }) => {
  return (
        <TreeNode label={<div>Block {block.blockName}</div>}>
      {block.floor.length > 0 && block.floor.map((floor, index) => (
        <Floor key={index} floor={floor} />
      ))}
    </TreeNode>
  );
};

export default Block;