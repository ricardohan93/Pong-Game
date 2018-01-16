      var canvas;
      var canvasContext;
      var ballX = 50; // horizontal position of ball
      var ballY = 50;
      var ballSpeedX = 15;
      var ballSpeedY = 6;

      var player1Score = 0;
      var player2Score = 0;
      const WINNING_SCORE = 3;

      var showingWinScreen = false;

      var paddle1Y = 250;
      var paddle2Y = 250;
      const PADDLE_HEIGHT = 100;
      const PADDLE_THICKNESS = 10;

      function calculateMousePos(event) { // event vai nos dar o mouse coordinates
        var rect = canvas.getBoundingClientRect(); // retorna size e position do canvas relative to viewport
        var root = document.documentElement; // retorna o html page
        var mouseX = event.clientX - rect.left - root.scrollLeft; // posição do mouseX = dentro do canvas posição do mouse - where in the page is the canvas - how far we scrolled the browser
        var mouseY = event.clientY - rect.top - root.scrollTop;

        return {
          x: mouseX,
          y: mouseY
        };
      }

      function handleMouseClick(event) {
        if(showingWinScreen) {
          player1Score = 0;
          player2Score = 0;
          showingWinScreen = false;
        }
      }

      window.onload = function() {
        console.log("Hello World");
        canvas = document.getElementById('gameCanvas');
        canvasContext = canvas.getContext('2d');

        var framespersecond = 30;

        setInterval(function() {
          draw();
          move();
        }, 1000/framespersecond); // chama a function draw a cada 1s

        canvas.addEventListener('mousedown', handleMouseClick);

        canvas.addEventListener('mousemove', function(event) {
          var mousePos = calculateMousePos(event);
          paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);

        });
      }

      function ballReset() {
        if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
          showingWinScreen = true;
        }

        ballX = canvas.width/2; // posiciona a bola de volta ao centro
        ballY = canvas.height/2;

        ballSpeedX = -ballSpeedX; // negativo com negativo vira positivo, aí a bola volta
      }

      function computerMovement() {
        var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2); // centraliza o movimento do paddle
        if (paddle2YCenter < ballY - 35) { // if paddle2YCenter está em cima da posição da bola, acrescenta pra descer
          paddle2Y += 6;
        } else if (paddle2YCenter > ballY + 35) {
          paddle2Y -= 6;
        }
      }

      function move() {
        if (showingWinScreen) {
          return; // return acaba com a function move() instantaneamente
        }

        computerMovement();

        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballX >= canvas.width) {
          if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2); // mostra o quão distante a bola está do centro do paddle. Se estiverem alinhados no centro, será 0. negativo se estiver abaixo, positivo se estiver acima do centro
            ballSpeedY = deltaY * 0.35;
          } else {
            player1Score++; // must be BEFORE ballReset()
            ballReset();
          }
        } else if (ballX < 0) {
          if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) { // se a bola estiver embaixo (ou seja, posição Y maior) do topo do paddle e acima (posição Y menor) do bottom do paddle.
            ballSpeedX = -ballSpeedX; // bola bate e volta na horizontal
            var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
          } else {
            player2Score++; // must be BEFORE ballReset()
            ballReset();
          }

        }

        if (ballY >= canvas.height) {
          ballSpeedY = -ballSpeedY;
        } else if (ballY < 0) {
          ballSpeedY = -ballSpeedY; // negativo com negativo vira positivo, aí a bola volta
        }
      }

      function drawNet() {
        for (var i = 0; i < canvas.height; i+=40) {
          colorRect(canvas.width/2-1, i, 2, 20, 'white');
        }
      }

      function draw() {
        // black canvas
        colorRect(0, 0, canvas.width, canvas.height, 'black');

        if (showingWinScreen) {
          if (player1Score >= WINNING_SCORE) {
            canvasContext.fillStyle = 'white';
            canvasContext.fillText('PLAYER 1 WON', 350, 200);
          } else if(player2Score >= WINNING_SCORE) {
            canvasContext.fillStyle = 'white';
            canvasContext.fillText('PLAYER 2 WON', 350, 200);
          }

          canvasContext.fillStyle = 'white';
          canvasContext.fillText('Click anywhere to continue', 350, 500);
          return; // return acaba com a function move() instantaneamente
        }

        drawNet()

        // left player paddle
        colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

        // computer player paddle
        colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

        // draws the ball
        colorCircle(ballX, ballY, 10, 'white');

        canvasContext.fillText(player1Score, 100, 100); // texto, posX e posY
        canvasContext.fillText(player2Score, canvas.width-100, 100);
      }

      function colorCircle(posX, posY, radius, color) {
        canvasContext.fillStyle = color;
        canvasContext.beginPath();
        canvasContext.arc(posX, posY, radius, 0, Math.PI*2, true); // (posX, posY, radius, angle, radian, clockwise) PI*2 = 360 deg
        canvasContext.fill();
      }

      function colorRect(posX, posY, width, height, color) {
        canvasContext.fillStyle = color;
        canvasContext.fillRect(posX, posY, width, height);
      }
