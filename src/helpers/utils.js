const leftLenght = [5, 4, 3, 2, 1];
const fullLenght = [5, 4, 3, 2, 1, 1, 2, 3, 4, 5];
const blockTypes = [
  'triangle',
  'square',
  'circle'
];


const getRandomNumber = (max, min = null) => {
  if (min === null) {
    return Math.floor(Math.random() * max);
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateBlock = index => {
  return {
    side: index < 5 ? 'left' : 'right',
    length: fullLenght[index],
    weights: [],
    animated:[],
    id: guidGenerator()
  }
};

const generateLengthAndWeight = animated => {
  const minIndex = animated ? 0 : 5;
  const maxIndex = animated
    ? leftLenght.length - 1
    : fullLenght.length - 1;
  const randomWeight = getRandomNumber(10, 1);
  const index = getRandomNumber(maxIndex, minIndex);
  
  if (prognozeForce(randomWeight, index) >= 20) {
    return generateLengthAndWeight(animated);
  }

  return {
    index,
    randomWeight
  };
};

const reducer = (acc, currItem) => {
  const totalWeight = currItem.weights.reduce((acc, currWeight) => {
    return acc + currWeight.weight;
  }, 0);
  const currItemForce = currItem.length * totalWeight;

  return acc + currItemForce;
};

const guidGenerator = () => {
  const S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };

  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

export const countForceDifference = blocks => {
  const leftSide = blocks.filter(block => block.side === 'left');
  const rightSide = blocks.filter(block => block.side === 'right');
  const leftForce = leftSide.reduce(reducer, 0);
  const rightForce = rightSide.reduce(reducer, 0);

  return rightForce - leftForce;
};

export const clearBlocks = blocks => {
  const clearedBlocks = [];
  
  blocks.forEach(block => {
    block.weights = [];
    block.animated = [];

    clearedBlocks.push(block);
  })

  return clearedBlocks;
}

export const generateWeightBlock = (animated) => {
  const { index, randomWeight } = generateLengthAndWeight(animated);
  const prognozed = prognozeForce(randomWeight, index);
  const block = {
    weight: randomWeight,
    type: blockTypes[getRandomNumber(blockTypes.length - 1)],
    top: animated ? 200 : 0,
    id: guidGenerator(),
    prognozedForce: prognozed
  };

  return {
    index,
    block
  };
};

export const prognozeForce = (weight, index) => {
  return fullLenght[index] * weight;
};

export const generateBlocks = (len) => {
  const bloks = [];

  for (let i = 0; i < len; i++) {
    bloks.push(generateBlock(i));
  }

  return bloks;
}