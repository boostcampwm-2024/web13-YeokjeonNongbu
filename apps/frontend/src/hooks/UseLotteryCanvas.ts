import { useRef, useState, useEffect } from 'react';
import { ERASE_RADIUS, ERASE_DISTANCE, WIDTH, HEIGHT } from '@/constants/LotteryConstants';

const UseLotteryCanvas = () => {
  const [isCanvasVisible, setIsCanvasVisible] = useState<boolean>(false);
  const [isScratching, setIsScratching] = useState<boolean>(false);
  const [isClear, setIsClear] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const erasedCount = useRef(0);
  let thresholdOfEraseCount = 0;

  const resetLottery = () => {
    setIsCanvasVisible(false);
    setIsScratching(false);
    setIsClear(false);
    erasedCount.current = 0;
  };

  const initCanvas = (context: CanvasRenderingContext2D) => {
    context.fillStyle = '#C9C9C9';
    context.fillRect(0, 0, WIDTH, HEIGHT);

    const col = Math.ceil(WIDTH / (ERASE_RADIUS * 2 + ERASE_DISTANCE));
    const row = Math.ceil(HEIGHT / (ERASE_RADIUS * 2 + ERASE_DISTANCE));
    thresholdOfEraseCount = col * row * 8;

    for (let i = 0; i < col; i++) {
      for (let j = 0; j < row; j++) {
        context.save();
        context.beginPath();
        context.arc(
          ERASE_RADIUS + i * (ERASE_RADIUS * 2 + ERASE_DISTANCE),
          ERASE_RADIUS + j * (ERASE_RADIUS * 2 + ERASE_DISTANCE),
          ERASE_RADIUS,
          0,
          2 * Math.PI,
          false
        );
        context.fill();
        context.closePath();
        context.restore();
      }
    }

    context.fillStyle = 'black';
    context.font = 'bold 20px sans-serif';
    context.textAlign = 'center';
    context.fillText('마우스로 긁어서 결과를 확인해보세요!', WIDTH / 2, HEIGHT / 2);
  };

  const clearCanvas = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, WIDTH, HEIGHT);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    initCanvas(context);

    const handleDrawing = (event: MouseEvent) => {
      if (!isDrawing.current) return;

      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      context.save();
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      context.arc(offsetX, offsetY, ERASE_RADIUS, 0, 2 * Math.PI, false);
      context.fill();
      context.restore();

      erasedCount.current += 1;

      if (erasedCount.current >= thresholdOfEraseCount) {
        clearCanvas(context);
        isDrawing.current = false;
        setIsScratching(false);
        setIsClear(true);
      }
    };

    const handleDrawingStart = () => {
      isDrawing.current = true;
    };
    const handleDrawingEnd = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener('mousedown', handleDrawingStart);
    canvas.addEventListener('mousemove', handleDrawing);
    canvas.addEventListener('mouseup', handleDrawingEnd);
    canvas.addEventListener('mouseleave', handleDrawingEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleDrawingStart);
      canvas.removeEventListener('mousemove', handleDrawing);
      canvas.removeEventListener('mouseup', handleDrawingEnd);
      canvas.removeEventListener('mouseleave', handleDrawingEnd);
    };
  }, [isCanvasVisible]);

  return {
    isCanvasVisible,
    isScratching,
    isClear,
    canvasRef,
    setIsCanvasVisible,
    setIsScratching,
    resetLottery
  };
};

export default UseLotteryCanvas;
