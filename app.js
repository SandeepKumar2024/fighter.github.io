const scoreDispaly = document.querySelector("#score");
const canvas = document.querySelector("canvas");
const submitBtn = document.querySelector("#submitBtn");
const uiScore = document.querySelector("#uiScore");
const uiEle = document.querySelector("#model");
const levelChangeEle = document.querySelector(".nextLevel");
const levelChangeText = document.querySelector(".nextLevel span");
const levelChangeBtn = document.querySelector(".nextLevel button");

canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext("2d");
console.log(c);
let score = 0;

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

//create the player
let player = new Player(x, y, 10, "white");
let particles = [];
let projectiles = [];
let enemies = [];

function init() {
  player = new Player(x, y, 10, "white");
  particles = [];
  projectiles = [];
  enemies = [];
}

//craete the projector

class Projectiles {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
class Enemeis {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();

    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

//craeting particle
class Particles {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw();

    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}

const projectile = new Projectiles(
  canvas.width / 2,
  canvas.height / 2,
  10,
  "red",
  {
    x: 1,
    y: 1,
  }
);
const projectile1 = new Projectiles(
  canvas.width / 2,
  canvas.height / 2,
  5,
  "green",
  {
    x: -1,
    y: -1,
  }
);

//span ememy
function spanEnemy() {
  setInterval(() => {
    const radius = Math.random() * (20 - 4) + 4;
    // console.log(radius);
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      //   console.log(x);
      y = Math.random() * canvas.height;
      // console.log("Y valu is:" + y);
    } else {
      x = Math.random() * canvas.width;
      // x = Math.random() * 10 ;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
      // console.log();
    }
    const color = `hsl(${Math.random() * 360},50%,50%)`;
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle) / 20,
      y: Math.sin(angle) / 20,
    };

    enemies.push(new Enemeis(x, y, radius, color, velocity));
  }, 1000);
}

let animationId;
function animate() {
  animationId = requestAnimationFrame(animate); // start the animation
  c.fillStyle = "rgba(0,0,0,0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
  projectiles.forEach((projectile, index) => {
    projectile.update();

    //out of edge of canvas then removed
    // if (
    //   projectile.x + projectile.radius < 0 ||
    //   projectile.x - projectile.radius > canvas.width ||
    //   projectile.y + projectile.radius < 0 ||
    //   projectile.x - projectile.radius > canvas.height
    // ) {
    //   setTimeout(() => {
    //     projectiles.splice(index, 1);
    //   }, 0);
    // }
  });

  enemies.forEach((enemy, index) => {
    enemy.update();
    //end the game
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - player.radius - enemy.radius < 1) {
      cancelAnimationFrame(animationId); // stop the animation
      uiEle.style.display = "flex";
      uiScore.innerHTML = score;
    }

    //craete exploision
    projectiles.forEach((projectile, pIndix) => {
      //hit collisoin
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      if (dist - projectile.radius - enemy.radius < 1) {
        for (let i = 0; i < enemy.radius; i++) {
          particles.push(
            new Particles(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 8),
                y: (Math.random() - 0.5) * (Math.random() * 8),
              }
            )
          );
        }
        //enemy hit
        if (enemy.radius - 10 > 10) {
          //increase the score
          score += 100;
          scoreDispaly.innerHTML = score;
          enemy.radius -= 10;
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          setTimeout(() => {
            projectiles.splice(pIndix, 1);
          }, 0);
        } else {
          //increase the score
          score += 350;
          scoreDispaly.innerHTML = score;
          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(pIndix, 1);
          }, 0);
        }
        // if (score > 500) {

        //   levelChangeEle.style.display = "flex";
        // }
      }
    });
  });
}
addEventListener("click", (e) => {
  //   console.log(projectiles);
  const angle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(angle) * 10,
    y: Math.sin(angle) * 10,
  };

  projectiles.push(
    new Projectiles(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
  );
});

submitBtn.addEventListener("click", () => {
  init();
  animate();
  spanEnemy();
  uiEle.style.display = "none";
  score = 0;
  scoreDispaly.innerHTML = score;
  uiScore.innerHTML = score;
});

// console.log(gsap)
