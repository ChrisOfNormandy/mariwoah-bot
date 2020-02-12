module.exports = {
    fish: {
        'common': {
            'rainbow_trout': {
                link: 'https://en.wikipedia.org/wiki/Rainbow_trout',
                image: 'https://en.wikipedia.org/wiki/Rainbow_trout#/media/File:Female_Rainbow_Trout_in_hand.JPG',
                type: 'freshwater',
                time: 'dawn/dusk',
                minSize: 8,
                maxSize: 48,
                weightFunc: function (size) { return Math.pow(10, -3.449 + 3.098 * Math.log10(size)); },
                costPerLb: 6
            },
            'brook_trout': {
                link: 'https://en.wikipedia.org/wiki/Brook_trout',
                image: 'https://en.wikipedia.org/wiki/Brook_trout#/media/File:Salvelinus_fontinalis_Prague_Vltava_4.jpg',
                type: 'freshwater',
                time: 'morning',
                minSize: 6,
                maxSize: 34,
                weightFunc: function (size) { return Math.pow(10, -3.467 + 3.043 * Math.log10(size)); },
                costPerLb: 6
            },
            'chinook_salmon': {
                link: 'https://en.wikipedia.org/wiki/Chinook_salmon',
                image: 'https://en.wikipedia.org/wiki/Chinook_salmon#/media/File:OncorhynchusTschawytscha2.jpg',
                type: 'freshwater',
                time: 'morning',
                minSize: 8,
                maxSize: 60,
                weightFunc: function (size) { return Math.pow(10, -3.243 + 3.901 * Math.log10(size)); },
                costPerLb: 21
            },
            'northern_pike': {
                link: 'https://en.wikipedia.org/wiki/Northern_pike',
                image: 'https://en.wikipedia.org/wiki/Northern_pike#/media/File:Esox_lucius1.jpg',
                type: 'freshwater',
                time: 'dawn/dusk',
                minSize: 4,
                maxSize: 55,
                weightFunc: function (size) { return Math.pow(10, -3.727 + 3.059 * Math.log10(size)); },
                costPerLb: 4.7
            },
            'striped_bass': {
                link: 'https://en.wikipedia.org/wiki/Striped_bass',
                image: 'https://en.wikipedia.org/wiki/Striped_bass#/media/File:Morone_saxatilis_SI2.jpg',
                type: 'saltwater',
                time: 'dawn/dusk',
                minSize: 6,
                maxSize: 60,
                weightFunc: function (size) { return Math.pow(10, -3.358 + 3.007 * Math.log10(size)); },
                costPerLb: 17
            },
            'white_bass': {
                link: 'https://en.wikipedia.org/wiki/White_bass',
                image: 'https://en.wikipedia.org/wiki/White_bass#/media/File:White_Bass,_Caught_and_Released.JPG',
                type: 'freshwater',
                time: 'day',
                minSize: 5,
                maxSize: 17,
                weightFunc: function (size) { return Math.pow(10, -3.394 + 3.081 * Math.log10(size)); },
                costPerLb: 20
            },
            'largemouth_bass': {
                link: 'https://en.wikipedia.org/wiki/Largemouth_bass',
                image: 'https://en.wikipedia.org/wiki/Largemouth_bass#/media/File:Largemouth.JPG',
                type: 'freshwater',
                time: 'dawn/dusk',
                minSize: 6,
                maxSize: 29,
                weightFunc: function (size) { return Math.pow(10, -3.49 + 3.191 * Math.log10(size)); },
                costPerLb: 6
            },
            'smallmouth_bass': {
                link: 'https://en.wikipedia.org/wiki/Smallmouth_bass',
                image: 'https://en.wikipedia.org/wiki/Smallmouth_bass#/media/File:Smallmouth_bass.png',
                type: 'freshwater',
                time: 'dawn/dusk',
                minSize: 8,
                maxSize: 27,
                weightFunc: function (size) { return Math.pow(10, -3.347 + 3.055 * Math.log10(size)); },
                costPerLb: 4.7
            },
            'bluegill': {
                link: 'https://en.wikipedia.org/wiki/Bluegill',
                image: 'https://en.wikipedia.org/wiki/Bluegill#/media/File:Bluegill_(fish).jpg',
                type: 'freshwater',
                time: 'evening',
                minSize: 4,
                maxSize: 16,
                weightFunc: function (size) { return Math.pow(10, -3.371 + 3.316 * Math.log10(size)); },
                costPerLb: 33
            },
            'black_crappie': {
                link: 'https://en.wikipedia.org/wiki/Black_crappie',
                image: 'https://en.wikipedia.org/wiki/Black_crappie#/media/File:Pomoxis_nigromaculatus1.jpg',
                type: 'freshwater',
                time: 'night',
                minSize: 4,
                maxSize: 19,
                weightFunc: function (size) { return Math.pow(10, -3.576 + 3.345 * Math.log10(size)); },
                costPerLb: 8
            },
            'white_crappie': {
                link: 'https://en.wikipedia.org/wiki/White_crappie',
                image: 'https://en.wikipedia.org/wiki/White_crappie#/media/File:White_Crappie.jpg',
                type: 'freshwater',
                time: 'morning',
                minSize: 4,
                maxSize: 21,
                weightFunc: function (size) { return Math.pow(10, -3.618 + 3.332 * Math.log10(size)); },
                costPerLb: 5.5
            },
            'walleye': {
                link: 'https://en.wikipedia.org/wiki/Walleye',
                image: 'https://en.wikipedia.org/wiki/Walleye#/media/File:Walleye_painting.jpg',
                type: 'freshwater',
                time: 'night',
                minSize: 6,
                maxSize: 42,
                weightFunc: function (size) { return Math.pow(10, -3.642 + 3.18 * Math.log10(size)); },
                costPerLb: 10.5
            },
            'sauger': {
                link: 'https://en.wikipedia.org/wiki/Sauger',
                image: 'https://en.wikipedia.org/wiki/Sauger#/media/File:Saugernctc.jpg',
                type: 'freshwater',
                time: 'day',
                minSize: 3,
                maxSize: 29,
                weightFunc: function (size) { return Math.pow(10, -3.669 + 3.157 * Math.log10(size)); },
                costPerLb: 10.5
            },
            'yellow_perch': {
                link: 'https://en.wikipedia.org/wiki/Yellow_perch',
                image: 'https://en.wikipedia.org/wiki/Yellow_perch#/media/File:YellowPerch.jpg',
                type: 'freshwater',
                time: 'dawn/dusk',
                minSize: 4,
                maxSize: 16,
                weightFunc: function (size) { return Math.pow(10, -3.506 + 3.23 * Math.log10(size)); },
                costPerLb: 3
            }
        },
        'uncommon': {
            'muskellunge': {
                link: 'https://en.wikipedia.org/wiki/Muskellunge',
                image: 'https://en.wikipedia.org/wiki/Muskellunge#/media/File:Esox_masquinongyeditcrop.jpg',
                type: 'freshwater',
                time: 'night',
                minSize: 7,
                maxSize: 72,
                weightFunc: function (size) { return Math.pow(10, -4.126 + 3.337 * Math.log10(size)); },
                costPerLb: 4.7
            }
        }
    },
    fishloot: {
        'common': {
            'boot': {
                link: 'https://en.wikipedia.org/wiki/Boot',
                image: 'https://en.wikipedia.org/wiki/Boot#/media/File:PinkVisual_boots.jpg',
                type: 'item',
                time: 'all',
                minSize: 1,
                maxSize: 1,
                costPerItem: 0.5
            },
            'algae': {
                link: 'https://en.wikipedia.org/wiki/Algae',
                image: 'https://en.wikipedia.org/wiki/Algae#/media/File:NSW_seabed_1.JPG',
                type: 'item',
                time: 'all',
                minSize: 0.1,
                maxSize: 1,
                costPerItem: 0.01
            },
            'bucket_hat': {
                link: 'https://en.wikipedia.org/wiki/Bucket_hat',
                image: 'https://en.wikipedia.org/wiki/Bucket_hat#/media/File:Wirksworth_MMB_01_Ecclesbourne_Valley_Railway_101XXX.jpg',
                type: 'item',
                time: 'all',
                minSize: 1,
                maxSize: 1,
                costPerItem: 0.75
            }
        }
    },
    ores: {

    },
    gems: {

    },
    materials: {

    }
}