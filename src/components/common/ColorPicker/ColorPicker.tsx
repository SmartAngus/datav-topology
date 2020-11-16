import React, { useState } from 'react';
import reactCSS from 'reactcss';
import { Button } from 'antd';
import { SketchPicker } from 'react-color';
import styleScss from './ColorPicker.module.scss';

interface ColorPickerProps {
  onChange?: (value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const { onChange } = props;
  const [visible, setVisible] = useState(false);
  const [color, setColor] = useState('#ffffff');

  const triggerChange = (color: string) => {
    if (onChange) {
      onChange(color);
    }
  };

  const handleClick = () => {
    setVisible(!visible);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleChange = (color) => {
    setColor(color.hex);
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
          <Button type="primary" onClick={handleSetColor}>
            确定
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ColorPicker;
