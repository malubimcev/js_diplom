'use strict';

class Vector {

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  
  plus(vector) {
    if (!(vector instanceof Vector)) {
      throw Error('Можно прибавлять к вектору только вектор типа Vector.');
    }      
    return new Vector(this.x + vector.x, this.y + vector.y);
  }
  
  times(multiplicator) {
    return new Vector(this.x * multiplicator, this.y * multiplicator);
  }

}//end of class Vector


class Actor {

  constructor(position, size, speed) {
    if (!position) {
      this.pos = new Vector(0, 0);
    } else if (!(position instanceof Vector)) {
      throw Error('Аргумент position не является вектором типа "Vector"');
    } else {
      this.pos = position;
    }

    if (!size) {
      this.size = new Vector(1, 1);
    } else if (!(size instanceof Vector)) {
      throw Error('Аргумент size не является вектором типа "Vector"');
    } else {
      this.size = size;
    }
    
    if (!speed) {
      this.speed = new Vector(0, 0);
    } else if (!(speed instanceof Vector)) {
      throw Error('Аргумент speed не является вектором типа "Vector"');
    } else {
      this.speed = speed;
    }
  }

  act() {
    //реализация в дочерних классах
  }

  isIntersect(actor) {
    //функции сравнения координат по каждой границе объекта:
    const isIntersectX = () => (actor.right > this.left) && (actor.left < this.right);//сравнение по X
    const isIntersectY = () => (actor.bottom > this.top) && (actor.top < this.bottom);//сравнение по Y

    if ((!actor) || (!(actor instanceof Actor))) {
      throw Error('Некорректный аргумент метода "isIntersect()". Требуется аргумент типа "Actor"');
    } else if(actor === this) {
      return false;
    }
    return isIntersectX() && isIntersectY();
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

  constructor(grid, actors) {
    this.grid = grid || [];
    this.actors = actors || [];
    this.status = null;
    this.finishDelay = 1;
    this.player = this.actors.find(item => item.type === 'player');
    this.height = this.grid.length;
    const lengthes = this.grid.map(item => item.length);
    this.width = Math.max(0, ...lengthes);
  }

  isFinished() {
    return (this.status != null) && (this.finishDelay < 0);
  }

  actorAt(actor) {
    if ((!actor) || (!(actor instanceof Actor))) {
      throw Error('Некорректный аргумент метода actorAt() объекта Actor');
    }
    //...
  }

  obstacleAt(toPosition, size) {
    if((!toPosition instanceof Vector) || (!(size instanceof Vector))) {
      throw Error('Аргументы метода obstacleAt объекта Level должны иметь тип Vector');
    }
    //...
  }

  removeActor(actor) {
    const index = this.actors.indexOf(actor);
    if (index > -1) {
      this.actors.splice(index, 1);
    }
  }

  noMoreActors(actorType) {
    return !this.actors.includes(actorType);
  }

  playerTouched(objectType, actor) {
    if (this.status) {
      return;
    }
    if (objectType === 'coin') {
      if ((actor) && (actor instanceof Coin)) {
        this.removeActor(actor);
        if (this.noMoreActors('coin')) {
          this.status = 'won';
        }
      }
    } else if (objectType === 'lava' || objectType === 'fireball') {
      this.status = 'lost';
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
    //временно через switch, потом переделать на словарь
    switch(symbol) {
      case '@':
        return Player;
        break;
      case 'o':
        return Coin;
        break;
      case '=':
        return HorizontalFireball;
        break;
      case '|':
        return VerticalFireball;
        break;
      case 'v':
        return FireRain;
        break;
      default:
        return undefined;
        break;
    }
  }

  obstacleFromSymbol(symbol) {
    //временно через switch, потом переделать на словарь
    switch(symbol) {
      case 'x':
        return 'wall';
        break;
      case '!':
        return 'lava';
        break;
      default:
        return undefined;
        break;
    }
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

  constructor(position = new Vector(0, 0), speed = new Vector(0, 0)) {
    super(position, new Vector(1, 1), speed);
  }

  get type() {
    return 'fireball';
  }

  getNextPosition(time = 1) {
    return this.pos.plus(this.speed.times(time));
  }

  handleObstacle() {
    this.speed.times(-1);
  }

  act(time, level) {
    //...
  }

}//end of class Fireball


class HorizontalFireball extends Fireball {

  constructor(position) {
    super(position, new Vector(2, 0));
  }

}//end of class HorizontalFireball


class VerticalFireball extends Fireball {

  constructor(position) {
    super(position, new Vector(0, 2));
  }

}//end of class VerticalFireball


class FireRain extends Fireball {

  constructor(position = new Vector(0, 0)) {
    super(position, new Vector(0, 3));
    this.startPos = position;
  }

  handleObstacle() {
    this.speed.times(1);//переопределяем метод родителя
    this.pos = this.startPos;
  }

}//end of class FireRain


class Coin extends Actor {

  constructor(position = new Vector(0, 0)) {
    super(position.plus(new Vector(0.2, 0.1)), new Vector(0.6, 0.6), new Vector(0, 8));
    this.startPos = position;  
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = Math.random() * 2 * Math.PI;
  }

  get type() {
    return 'coin';
  }

  updateSpring(time = 1) {
    this.spring += this.springSpeed * time;
  }

  getSpringVector() {
    return new Vector(0, this.springDist * Math.sin(this.spring));
  }

  getNextPosition(time = 1) {
    return this.startPos.plus(this.getSpringVector());
  }

  act(time = 1) {
    this.pos = this.getNextPosition(time);
  }

}//end of class Coin


class Player extends Actor {

  constructor(position = new Vector(0, 0)) {
    super(position.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5), new Vector(0, 0));
  }

  get type() {
    return 'player';
  }

}//end of class Player