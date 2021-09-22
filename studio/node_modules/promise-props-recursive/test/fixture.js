'use strict'

var animalSoundMap = {
    cow: 'moo',
    crow: 'caw',
    cricket: 'chirp',
    horse: 'neigh',
    sheep: 'bleat',
    snake: 'hiss',
    lion: 'roar',
    bird: 'tweet',
    cat: 'meow',
    dog: 'bark',
    cockatoo: 'tweet',
    tit: 'tweet'
}

function resolveSound(animal, shouldFail) {
    return new Promise(function(resolve, reject) {
        setImmediate(function() {
            if (shouldFail) {
                return reject('told to fail')
            } else if (!animalSoundMap[animal]) {
                return reject('no idea what sound `' + animal + '` makes')
            }

            return resolve(animalSoundMap[animal])
        })
    })
}

module.exports = resolveSound
