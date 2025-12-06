"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * SnakeLoader - Y2K Nokia Animated Snake game loading screen
 *
 * Visual: 10x10 green grid with snake moving and eating food
 * Used during API calls for a retro gaming experience
 */

const GRID_SIZE = 10;
const INITIAL_SNAKE = [
  { x: 5, y: 5 },
  { x: 4, y: 5 },
  { x: 3, y: 5 },
];

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

interface Position {
  x: number;
  y: number;
}

interface SnakeLoaderProps {
  message?: string;
}

export default function SnakeLoader({
  message = "COMPILING REPAIR SCHEMATIC...",
}: SnakeLoaderProps) {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 7, y: 5 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [foodVisible, setFoodVisible] = useState(true);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }, []);

  // Move snake
  useEffect(() => {
    const moveSnake = () => {
      setSnake((prev) => {
        const head = prev[0];
        let newHead: Position;

        switch (direction) {
          case "UP":
            newHead = { x: head.x, y: (head.y - 1 + GRID_SIZE) % GRID_SIZE };
            break;
          case "DOWN":
            newHead = { x: head.x, y: (head.y + 1) % GRID_SIZE };
            break;
          case "LEFT":
            newHead = { x: (head.x - 1 + GRID_SIZE) % GRID_SIZE, y: head.y };
            break;
          case "RIGHT":
            newHead = { x: (head.x + 1) % GRID_SIZE, y: head.y };
            break;
        }

        // Check if eating food
        if (newHead.x === food.x && newHead.y === food.y) {
          const newSnake = [newHead, ...prev];
          // Keep snake at reasonable length
          if (newSnake.length > 8) {
            newSnake.pop();
          }
          setFood(generateFood(newSnake));
          return newSnake;
        }

        // Normal movement
        const newSnake = [newHead, ...prev.slice(0, -1)];
        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [direction, food, generateFood]);

  // Change direction periodically for visual interest
  useEffect(() => {
    const changeDirection = () => {
      const directions: Direction[] = ["UP", "DOWN", "LEFT", "RIGHT"];
      const opposites: Record<Direction, Direction> = {
        UP: "DOWN",
        DOWN: "UP",
        LEFT: "RIGHT",
        RIGHT: "LEFT",
      };

      setDirection((prev) => {
        const available = directions.filter((d) => d !== opposites[prev]);
        return available[Math.floor(Math.random() * available.length)];
      });
    };

    const interval = setInterval(changeDirection, 800 + Math.random() * 400);
    return () => clearInterval(interval);
  }, []);

  // Food blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFoodVisible((prev) => !prev);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Generate grid cells
  const renderGrid = () => {
    const cells = [];

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnakeHead = snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.slice(1).some((s) => s.x === x && s.y === y);
        const isFood = food.x === x && food.y === y;

        let cellStyle: React.CSSProperties = {
          background: 'rgba(0, 30, 60, 0.6)',
        };
        let cellContent = null;

        if (isSnakeHead) {
          cellStyle = {
            background: '#39ff14',
            boxShadow: '0 0 10px #39ff14, 0 0 20px rgba(57, 255, 20, 0.5)',
          };
          cellContent = (
            <div 
              className="w-full h-full flex items-center justify-center text-[6px]"
              style={{ color: '#040810' }}
            >
              ●
            </div>
          );
        } else if (isSnakeBody) {
          const bodyIndex = snake.findIndex((s) => s.x === x && s.y === y);
          const opacity = 1 - (bodyIndex / snake.length) * 0.5;
          cellStyle = {
            background: `rgba(57, 255, 20, ${opacity})`,
            boxShadow: `0 0 ${5 * opacity}px rgba(57, 255, 20, ${opacity * 0.5})`,
          };
        } else if (isFood && foodVisible) {
          cellStyle = {
            background: '#ff0055',
            boxShadow: '0 0 10px #ff0055, 0 0 20px rgba(255, 0, 85, 0.5)',
          };
        }

        cells.push(
          <div
            key={`${x}-${y}`}
            className="w-4 h-4 transition-all duration-75"
            style={{
              ...cellStyle,
              border: '1px solid rgba(0, 229, 255, 0.1)',
            }}
          >
            {cellContent}
          </div>
        );
      }
    }

    return cells;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Game Title */}
      <div 
        className="text-xs tracking-[0.3em] opacity-60"
        style={{ color: '#00e5ff' }}
      >
        ◈ NOKIA SNAKE ◈
      </div>

      {/* Game Grid */}
      <div 
        className="nokia-border p-3"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 59, 122, 0.2) 0%, rgba(0, 20, 40, 0.9) 100%)',
        }}
      >
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {renderGrid()}
        </div>
      </div>

      {/* Score Display */}
      <div className="flex items-center gap-6 text-xs">
        <div className="text-center">
          <div className="text-[#666] tracking-wider">LENGTH</div>
          <div
            style={{ 
              fontFamily: "var(--font-pixel)",
              color: '#39ff14',
              textShadow: '0 0 10px rgba(57, 255, 20, 0.5)'
            }}
          >
            {snake.length}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[#666] tracking-wider">SPEED</div>
          <div
            style={{ 
              fontFamily: "var(--font-pixel)",
              color: '#00e5ff',
              textShadow: '0 0 10px rgba(0, 229, 255, 0.5)'
            }}
          >
            LV.2
          </div>
        </div>
      </div>

      {/* Loading Message */}
      <div
        className="text-sm tracking-widest animate-pulse text-center"
        style={{ 
          fontFamily: "var(--font-pixel)",
          color: '#ffaa00',
          textShadow: '0 0 10px rgba(255, 170, 0, 0.5)'
        }}
      >
        {message}
      </div>

      {/* Progress Dots */}
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-2 h-2 animate-[loader-pulse_1s_ease-in-out_infinite]"
            style={{
              backgroundColor: '#00e5ff',
              animationDelay: `${i * 0.2}s`,
              boxShadow: '0 0 5px #00e5ff',
            }}
          />
        ))}
      </div>
    </div>
  );
}
