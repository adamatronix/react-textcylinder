import React from 'react';
import TextCylinder from './TextCylinder';

export default {
  title: 'TextCylinder',
  parameters: {
    layout: 'fullscreen'
  }
};

export const Default = () => {
  return (
    <div style={{width: '100%', height: '100vh'}}>
       <TextCylinder />
    </div>
  );
}