'use strict';

class Vector {

  // можно добавить значения по-умолчанию
  constructor(x, y) {
    // это лишняя проверка
    if (x) {
      this.innerX = x;
    } else {
      this.innerX = 0;
    }
    // лишняя проверка
    if (y) {
      this.innerY = y;
    } else {
      this.innerY = 0;
    }
  }
  
  plus(vector) {
    if (vector instanceof Vector) {
      return new Vector(this.innerX + vector.x, this.innerY + vector.y);
    // если if заканчивается на return, то else можно не писать
    } else {
      // лучше сначала проверить исключительные ситуации,
      // а потом писать основной код
      throw Error('Можно прибавлять к вектору только вектор типа Vector.');
    }
  }
  
  // можно добавить значение по-умолчанию
  times(multiplicator) {
    return new Vector(this.innerX * multiplicator, this.innerY * multiplicator);
  }
  
  // так можно, только не забывайте,
  // что innerX и innerY доступны для изменения извне
  get x() {
    return this.innerX;
  }
  
  get y() {
    return this.innerY;
  }

}//end of class Vector


class Actor {

  // некорректные значения по-умолчанию
  constructor(position = null, size = null, speed = null) {
    // ?
    this.actorPos = new Vector(0, 0);
    this.actorSize = new Vector(1, 1);
    this.actorSpeed = new Vector(0, 0);

    // первая проверка лишняя
    if (position) {
      if (position instanceof Vector) {
        this.actorPos = position;
      } else {
        // сначала проверки, потом основной код лучше
        throw Error('Аргумент position не является вектором типа Vector');
      }
    }

    if (size) {
      if (size instanceof Vector) {
        this.actorSize = size;
      } else {
        throw Error('Аргумент size не является вектором типа Vector');
      }
    }
    
    if (speed) {
      if (speed instanceof Vector) {
        this.actorSpeed = speed;
      } else {
        throw Error('Аргумент speed не является вектором типа Vector');
      }
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
      // чтобы не экранировать кавычки можно использовать двойные, например
      throw Error('Некорректный аргумент метода \'isIntersect\'. Требуется аргумент типа \'Actor\'');
      // else не нужен, после throw выполнение закончится
    } else if(actor === this) {
      return false;
    // else не нужен
    } else {
      // по-моему лишнее усложение, но имеет право на жизнь
      return isLeftIntersect() && isRightIntersect() && isTopIntersect() && isBottomIntersect();
    }
  }

  get pos() {
    return this.actorPos;
  }

  // очень опасный код, если где-нибудь закрадётся ошибка,
  // отлаживаться будет очень сложно
  set pos(newPosition) {
    if ((newPosition) && (newPosition instanceof Vector)) {
      this.actorPos = newPosition;
    }
  }

  // по-моему лучше убрать эти уложения и сделать просто свойство size,
  // если у вас есть веские доводы в пользу такого решения - поделитесь
  get size() {
    return this.actorSize;
  }

  set size(newSize) {
    if ((newSize) && (newSize instanceof Vector)) {
      this.actorSize = newSize;
    }
  }

  get speed() {
    return this.actorSpeed;
  }

  set speed(newSpeed) {
    if ((newSpeed) && (newSpeed instanceof Vector)) {
      this.actorSpeed = newSpeed;
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

  // некорректные значения по-умолчанию
  constructor(grid = null, actors = null) {
    this.grid = grid || [];
    this.actors = actors || [];
    this.status = null;
    this.finishDelay = 1;
  }

  // это ошибка
  get grid() {
    return this.grid;
  }

  set grid(newGrid) {
    if (newGrid) {
      // тут тоже ошибка
      this.grid = grid;
    }
  }

  // ошибка
  get actors() {
    return this.actors;
  }

  set actors(newActors) {
    // ошибка
    if (actors) {
      this.actors = actors;
    }
  }

  // лучше задать в конструкторе, чтобы каждый раз не искать в массиве
  get player() {
    return this.actors.find( item => item.type = 'player' );
  }

  // я бы тоже в конструкторе это задал
  get height() {
    return this.grid.length;
  }

  get width() {
    // lengths
    const lengthes = this.grid.map( item => item.length );
    // направление правильное,
    // только если будет пустой массив то вернётся бесконечность
    // нужно добавить ещё один аргумент
    return Math.max(...lengthes);//это надо протестировать
  }

  // ошибка
  get status() {
    return this.status;
  }

  set status(newStatus) {
    // ошибка
    if (status) {
      this.status = newStatus;
    }
  }

  // ошибка
  get finishDelay() {
    return this.finishDelay;
  }

  // лишнее усложенение
  set finishDelay(newDelay) {
    if (newDelay) {//подумать о дополнительных проверках: NaN, диапазон, >0 и т.п.
      this.finishDelay = newDelay;
    }
  }

  isFinished() {
    // первая половина выражения написана неправильно
    // true/false никогда не будут равны null
    // скобки можно опустить
    return (!this.status === null) && (finishDelay < 0);
  }

  actorAt(actor) {
    if ((!actor) || (!actor instanceof Actor)) {
      throw Error('Некорректный аргумент метода actorAt() объекта Actor');
    // else не нужен
    } else {
      //...

    }
  }

  obstacleAt(toPosition, size) {
    if((!toPosition instanceof Vector) || (!size instanceof Vector)) {
      throw Error('Аргументы метода obstacleAt объекта Level должны иметь тип Vector');
    // else не нужен
    } else {
      //...
    }
  }

  removeActor(actor) {
    // лишняя проверка
    if (actor instanceof Actor) {//подумать о дополнительных проверках
      //...найти в массиве actors[] и вырезать
      // метод неправильно отработает, если объект не будет найден
      this.actors.splice(this.actors.indexOf(actor), 1);//или findIndex?
      // это совсем лишняя строчка, зачем вы её написали?
      //ссылку тоже обнуляем:
      actor = null;
    }
  }

  noMoreActors(actorType) {
    // проверку можно убрать
    if (actorType instanceof String) {
      // неправильно отработает на пустом массиве
      // (лучше использовать другой метод массива)
      return actors.every( item => item.type !== actorType );
    }
    return false;
  }

  playerTouched(objectType, actor = null) {
    // лучше обратить условие и прервать выполнение функции,
    // чтобы уменьшить вложенность кода
    if (this.status) {
      // switch тут не самая удачная конструкция,
      // сложно разобраться в коде
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

  // лучше добавить значение по-умолчанию
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

  // некорректные значения по-умолчанию
  constructor(position = null, speed = null) {
    super(position, new Vector(1, 1), speed);
  }

  get type() {
    return 'fireball';
  }

  getNextPosition(time = 1) {
    // лишняя проверка, по-моему
    if (time < 0) {
      time = 0;
    }
    return this.pos.plus(this.speed.times(time));
  }

  handleObstacle() {
    // мутирование объекта Vector - плохо,
    // ошибки сложно будет искать потом
    // тут нужно использовать мтеод класса Vector
    this.speed.x *= -1;
    this.speed.y *= -1;
  }

  act(time, level) {
    //...
  }

}//end of class Fireball


class HorizontalFireball extends Fireball {

  // значение по-умолчанию
  constructor(position) {
    super(position, new Vector(2, 0));
  }

}//end of class HorizontalFireball


class VerticalFireball extends Fireball {
  // значение по-умолчанию
  constructor(position) {
    super(position, new Vector(0, 2));
  }
}//end of class VerticalFireball


class FireRain extends Fireball {

  // значение по-умолчанию
  constructor(position) {
    super(position, new Vector(0, 3));
  }

  handleObstacle() {
    // эта строчка ничего не делает
    this.speed.y *= 1;
  }

}//end of class FireRain


class Coin extends Actor {

  constructor(position) {
    // первая половина проверки лишняя
    // я бы убрал проверку вообще и добавил значение по-умолчанию для аргумента
    if ((position) && (position instanceof Vector)) {
      super(position.plus(0.2, 0.1), new Vector(0.6, 0.6), new Vector(0, 8));
    }    
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = 0;//переделать: случайное число 0...2pi
  }

  // неправильное название свойства
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
    // заменил бы на значение по-умолчанию
    if ((position) && (position instanceof Vector)) {
      super(position.plus(0, -0.5), new Vector(0.8, 1.5), new Vector(0, 0));
    }
  }

  // неправильное название свойства
  get Type() {
    return 'player';
  }

}//end of class Player