import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
const Unit = ({ unit }) => {
  return (
    <TreeNode label={<div>{unit.userName}</div>}>
    </TreeNode>
  );
};

export default Unit;