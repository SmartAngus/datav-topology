import React, {useEffect, useState} from 'react';
import reactCSS from 'reactcss';
import {Button, message} from 'antd';
import { SketchPicker } from 'react-color';
import styleScss from './ColorPicker.module.scss';
import {useMount, useUpdate} from "ahooks";

interface ColorPickerProps {
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = (props: ColorPickerProps) => {
  const { value, disabled, onChange } = props;
  const [visible, setVisible] = useState(false);
  const [color, setColor] = useState(value);
  useEffect(()=>{
    setColor(value)
  },[value])
  
  const triggerChange = (color: string) => {
    if (onChange) {
      onChange(color);
    }
  };

  const handleClick = () => {
    setVisible(!visible);
  };

  const handleClose = () => {
    setColor(value ? value : 'rgba(155, 155, 155 ,1)');
    setVisible(false);
  };

  const handleChange = (color: any) => {
    setColor(
      `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
    );
  };

  const handleSetColor = () => {
    triggerChange(color);
    setVisible(false);
  };

  const styles = reactCSS({
    default: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: color,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
        marginTop: '5px',
      },
      popover: {
        position: 'fixed',
        zIndex: '2',
        right: 300,
        top: 150,
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>
      {visible ? (
        <div style={styles.popover} className={styleScss.colorPickerContainer}>
          <div style={styles.cover} onClick={handleClose} />
          <SketchPicker
            className={styleScss.myColorPicker}
            color={color}
            onChange={handleChange}
          />
          <Button onClick={handleClose} style={{ marginRight: 20 }}>
            取消
          </Button>
          <Button type="primary" onClick={handleSetColor} disabled={disabled}>
            确定
          </Button>
        </div>
      ) : null}
    </div>
  );
};


export default ColorPicker;
