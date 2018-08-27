'use strict';

class Vector {
  constructor(x, y) {
    if (x) {
      this.innerX = x;
    } else {
      this.innerX = 0;
    }
    if (y) {
      this.innerY = y;
    } else {
      this.innerY = 0;
    }
  }
  
  plus(vector) {
    if (vector instanceof Vector) {
      return new Vector(this.innerX + vector.x, this.innerY + vector.y);
    } else {
      throw 'Можно прибавлять к вектору только вектор типа Vector.';
    }
  }
  
  times(multiplicator) {
    return new Vector(this.innerX * multiplicator, this.innerY * multiplicator);
  }
  
  get x() {
    return this.innerX;
  }
  
  get y() {
    return this.innerY;
  }

}//end of class Vector


class Actor {
  constructor(position = null, size = null, speed = null) {
    if (position) {
      if (position instanceof Vector) {
        this.pos = position;
      } else {
        throw 'Аргумент position не является вектором типа Vector';
      }
    } else {
      this.pos = new Vector(0, 0);
    }
    if (size)  {
      if(size instanceof Vector) {
        this.size = size;
      } else {
        throw 'Аргумент size не является вектором типа Vector';
      }
    } else {
      this.size = new Vector(1, 1);
    }
    if (speed) {
      if(speed instanceof Vector) {
        this.speed = speed;
      } else {
        throw 'Аргумент speed не является вектором типа Vector';
      }
    } else {
      this.speed = new Vector(0, 0);
    }
  }

  act() {
    //реализация в дочерних классах
  }

  isIntersect(actor) {
    //функции сравнения координат по каждой границе объекта:
    const isLeftIntersect = () => actor.right > this.left;//сравнение по левому краю
    const isRightIntersect = () => actor.left < this.right;//сравнение по правому краю
    const isTopIntersect = () => actor.bottom > this.top;//сравнение по вернему краю
    const isBottomIntersect = () => actor.top < this.bottom;//сравнение по нижнему краю


    if ((!actor) || (!(actor instanceof Actor))) {
      throw 'Некорректный аргумент метода \'isIntersect\'. Требуется аргумент типа \'Actor\'';
    } else if(actor === this) {
      return false;
    } else {
      return isLeftIntersect() && isRightIntersect() && isTopIntersect() && isBottomIntersect();
    }
  }

  get pos() {
    return this.position;
  }

  set pos(newPosition) {
    if ((newPosition) && (newPosition instanceof Vector)) {
      this.pos = newPosition;
    }
  }

  get size() {
    return this.size;
  }

  set size(newSize) {
    if ((newSize) && (newSize instanceof Vector)) {
      this.size = newSize;
    }
  }

  get speed() {
    return this.speed;
  }

  set speed(newSpeed) {
    if ((newSpeed) && (newSpeed instanceof Vector)) {
      this.speed = newSpeed;
    }
  }

  get left() {
    return this.pos.x;
  }

  get top() {
    return this.pos.y;
  }

  get right() {
    return this.pos.x + this.size.x;
  }

  get bottom() {
    return this.pos.y + this.size.y;
  }

  get type() {
    return 'actor';
  }

}//end of class Actor


class Level {
  constructor(grid = null, actors = null) {
    this.grid = grid || [];
    this.actors = actors || [];
    this.status = null;
    this.finishDelay = 1;
  }

  get grid() {
    return this.grid;
  }

  set grid(newGrid) {
    if (newGrid) {
      this.grid = grid;
    }
  }

  get actors() {
    return this.actors;
  }

  set actors(newActors) {
    if (actors) {
      this.actors = actors;
    }
  }

  get player() {
    return this.actors.find( item => item.type = 'player' );
  }

  get height() {
    return this.grid.length;
  }

  get width() {
    const lengthes = this.grid.map( item => item.length );
    return Math.max(...lengthes);//это надо протестировать
  }

  get status() {
    return this.status;
  }

  set status(newStatus) {
    if (status) {
      this.status = newStatus;
    }
  }

  get finishDelay() {
    return this.finishDelay;
  }

  set finishDelay(newDelay) {
    if (newDelay) {//подумать о дополнительных проверках: NaN, диапазон, >0 и т.п.
      this.finishDelay = newDelay;
    }
  }

  isFinished() {
    return (!this.status === null) && (finishDelay < 0);
  }

  actorAt(actor) {
    if ((!actor) || (!actor instanceof Actor)) {
      throw 'Некорректный аргумент метода actorAt() объекта Actor';
    } else {
      //...

    }
  }

  obstacleAt(toPosition, size) {
    if((!toPosition instanceof Vector) || (!size instanceof Vector)) {
      throw 'Аргументы метода obstacleAt объекта Level должны иметь тип Vector';
    } else {
      //...
    }
  }

  removeActor(actor) {
    if (actor instanceof Actor) {//подумать о дополнительных проверках
      //...найти в массиве actors[] и вырезать
      this.actors.splice(this.actors.indexOf(actor), 1);//или findIndex?
      //ссылку тоже обнуляем:
      actor = null;
    }
  }

  noMoreActors(actorType) {
    if (actorType instanceof String) {
      return actors.every( item => item.type !== actorType );
    }
    return false;
  }

  playerTouched(objectType, actor = null) {
    if (this.status) {
      switch(objectType) {
        case 'lava', 'fireball':
          this.status = 'lost';
          break;
        case 'coin':
          if ((actor) && (actor instanceof Coin)) {
            this.removeActor(actor);
            if (this.noMoreActors('coin')) {
              this.status = 'won';
            }
          }
          break;
        default:
          //...
          break;
      }
    }
  }


}//end of class Level


class LevelParser {
  constructor(dict) {
    this.dict = dict;
    this.grid = [];
    this.actors = [];
  }

  actorFromSymbol(symbol) {
    //...
  }

  obstacleFromSymbol(symbol) {
    //...
  }

  createGrid(symbols) {
    //...
    return this.grid;
  }

  createActors() {
    //...
    return this.actors;
  }

  parse(objects) {
    const level = new Level(this.grid, this.actors);
    //...
    return level;
  }

}//end of class LevelParser


class Fireball extends Actor {
  constructor(position = null, speed = null) {
    this.size = new Vector(1, 1);
    super(position, this.size, speed);
  }

  get type() {
    return 'fireball';
  }

  getNextPosition(time = 1) {
    if (time < 0) {
      time = 0;
    }
    return this.pos.plus(this.speed.times(time));
  }

  handleObstacle() {
    this.speed.x *= -1;
    this.speed.y *= -1;
  }

  act(time, level) {
    //...
  }

}//end of class Fireball


class HorizontalFireball extends Fireball {
  constructor(position) {
    this.speed = new Vector(2, 0);
    super(position, this.speed);
  }
}//end of class HorizontalFireball


class VerticalFireball extends Fireball {
  constructor(position) {
    this.speed = new Vector(0, 2);
    super(position, this.speed);
  }
}//end of class VerticalFireball


class FireRain extends Fireball {
  constructor(position) {
    this.speed = new Vector(0, 3);
    super(position, this.speed);
  }

  handleObstacle() {
    this.speed.y *= 1;
  }

}//end of class FireRain


class Coin extends Actor {
  constructor(position) {
    if ((position) && (position instanceof Vector)) {
      this.pos = position.plus(0.2, 0.1);
    }    
    super(position, new Vector(0.6, 0.6), new Vector(0, 8));
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = 0;//переделать: случайное число 0...2pi
  }

  get Type() {
    return 'coin';
  }

  updateSpring(time = 1) {
    //добавить проверки time
    this.spring += this.springSpeed * time;
  }

  getSpringVector() {
    //...this.springDist * Math.sin(this.spring)
    return this.pos;
  }

  getNextPosition(time = 1) {
    //добавить проверки time
    //...
    return this.pos;
  }

  act(time) {
    //...
  }

}//end of class Coin


class Player extends Actor {
  constructor(position) {
    if ((position) && (position instanceof Vector)) {
      this.pos = position.plus(0, -0.5);
    }
    super(this.pos, new Vector(0.8, 1.5), new Vector(0, 0));
  }

  get Type() {
    return 'player';
  }

}//end of class Player