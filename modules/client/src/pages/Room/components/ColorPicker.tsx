import { type FC, useRef } from 'react';
import { IconButton, Box, Input } from '@chakra-ui/react';
import { ColorLens } from '@mui/icons-material';

interface Props {
  color: `#${string}`;
  onChangeColor: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ColorPicker: FC<Props> = ({ color, onChangeColor }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (): void => {
    inputRef.current?.click();
  };

  return (
    <Box position="relative">
      <IconButton
        aria-label="color-picker"
        icon={<ColorLens />}
        onClick={handleClick}
        bgColor={color}
      />
      <Input
        ref={inputRef}
        position="absolute"
        type="color"
        visibility="hidden"
        bottom={0}
        left={0}
        width={0}
        height={0}
        value={color}
        onChange={onChangeColor}
      />
    </Box>
  );
};

export default ColorPicker;
