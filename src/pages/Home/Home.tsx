import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface Circle {
  id: number;
  x: number;
  y: number;
  color?: string;
}

const Home: React.FC = () => {
  const [points, setPoints] = useState<number>(0);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [clickedIds, setClickedIds] = useState<number[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>("Let's Play");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Định dạng thời gian thành "giây.1/10 giây"
  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 1000);  // Tính số giây
    const tenthsOfSecond = Math.floor((time % 1000) / 100); // Lấy phần 1/10 giây
    return `${seconds}.${tenthsOfSecond}`; // Định dạng giây.1/10 giây
  };

  useEffect(() => {
    if (isPlaying && !gameOver) {
      timerRef.current = window.setInterval(() => setTime(prev => prev + 10), 10);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    // Xóa bỏ sự kiện interval khi sự kiện được unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, gameOver]);

  // hàm xử lý khi nhấn play
  const handlePlay = () => {
    if(!points || points === 0) {
      alert('Please enter points');
      return;
    } else {
      setCircles(generateCircles(points));
      setStatusMessage("Let's Play");
      setIsPlaying(true);
      setClickedIds([]);
      setGameOver(false);
      setTime(0);
    }
  };

  // Hàm tự sinh vòng tròn (các bida)
  const generateCircles = (count: number): Circle[] => {
    const generatedCircles: Circle[] = [];
    for (let i = 1; i <= count; i++) {
      generatedCircles.push({
        id: i,
        x: Math.random() * 300,
        y: Math.random() * 300,
        color: 'white'
      });
    }
    return generatedCircles;
  };

  // hàm xử lý khi click vào vòng tròn (bida)
  const handleCircleClick = (id: number) => {
    if (gameOver || clickedIds.includes(id)) return;

    const nextId = clickedIds.length + 1;
    if (id === nextId) {
      setClickedIds([...clickedIds, id]);

      // Đổi màu vòng tròn thành đỏ trước khi xóa
      setCircles(prevCircles => {
        const updatedCircles = prevCircles.map(circle =>
          circle.id === id ? { ...circle, color: 'red' } : circle
        );

        // Đặt timeout để xóa vòng tròn sau khi đổi màu
        setTimeout(() => {
          setCircles(updatedCircles.filter(circle => circle.id !== id));

          // Kiểm tra xem tất cả các vòng tròn đã bị nhấp hết chưa
          if (clickedIds.length + 1 === points) {
            setStatusMessage('All Cleared');
            setIsPlaying(false);
          }
        }, 300); // 300ms để hiển thị màu đỏ trước khi xóa

        return updatedCircles;
      });
    } else {
      setStatusMessage('Game Over');
      setGameOver(true);
      setIsPlaying(false);
    }
  };


  // hàm xử lý khi thay đổi giá trị input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setPoints(value);
    } else {
      setPoints(0);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="border-2 border-black p-4 w-[450px] h-[600px] bg-white rounded-lg">
        <div className="px-1 py-2 text-left">
          <p className={`text-3xl ${gameOver ? 'text-red-500' : statusMessage === 'All Cleared' ? 'text-green-500' : 'text-black'}`}>
            {statusMessage}
          </p>
          <div className="flex items-center mt-3">
            <span className="mr-2">Points</span>
            <TextField
              sx={{ padding: '2px' }}
              size="small"
              id="outlined-basic"
              label="Points"
              variant="outlined"
              value={points > 0 ? points : ''}
              onChange={handleInputChange}
              // disabled={isPlaying}
            />
          </div>
          <div className="flex items-center my-2">
            <span>Time:</span>
            <span className="ml-2">{formatTime(time)}s</span>
          </div>
          <Button
            variant="contained"
            color={isPlaying ? 'secondary' : 'primary'}
            onClick={handlePlay}
            size='small'
          >
            {isPlaying ? 'Restart' : 'Play'}
          </Button>
        </div>

        <div className="relative border-2 border-black w-[400px] h-[350px] mx-auto mt-4 overflow-hidden">
          {circles.map(circle => (
            <div
              key={circle.id}
              className="absolute flex items-center justify-center w-10 h-10 border-2 border-black rounded-full cursor-pointer"
              style={{
                backgroundColor: circle.color,
                top: circle.y,
                left: circle.x,
              }}
              onClick={() => handleCircleClick(circle.id)}
            >
              <span className="text-black">{circle.id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
