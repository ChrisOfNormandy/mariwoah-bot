module.exports = {
    fish: {
        'common': {
            'walleye': {
                link: 'https://en.wikipedia.org/wiki/Walleye',
                image: 'https://en.wikipedia.org/wiki/Walleye#/media/File:Walleye_painting.jpg',
                type: 'freshwater',
                time: 'night',
                minSize: 15,
                maxSize: 42,
                weightFunc: function(size) { return Math.pow(10, -3.642 + 3.18 * Math.log10(size)); },
                costPerLb: 10.5,
                expPerLb: 10
            },
            'smallmouth_bass': {
                link: 'https://en.wikipedia.org/wiki/Smallmouth_bass',
                image: 'https://en.wikipedia.org/wiki/Smallmouth_bass#/media/File:Smallmouth_bass.png',
                type: 'freshwater',
                time: 'dawn/dusk',
                minSize: 8,
                maxSize: 27,
                weightFunc: function(size) { return Math.pow(10, -3.347 + 3.055 * Math.log10(size)); },
                costPerLb: 4.7,
                expPerLb: 4
            },
            'sauger': {
                link: 'https://en.wikipedia.org/wiki/Sauger',
                image: 'https://en.wikipedia.org/wiki/Sauger#/media/File:Saugernctc.jpg',
                type: 'freshwater',
                time: 'day',
                minSize: 14,
                maxSize: 29,
                weightFunc: function(size) { return Math.pow(10, -3.669 + 3.157 * Math.log10(size)); },
                costPerLb: 10.5,
                expPerLb: 10
            },
            'largemouth_bass': {
                link: 'https://en.wikipedia.org/wiki/Largemouth_bass',
                image: 'https://en.wikipedia.org/wiki/Largemouth_bass#/media/File:Largemouth.JPG',
                type: 'freshwater',
                time: 'dawn/dusk',
                minSize: 14,
                maxSize: 29,
                weightFunc: function(size) { return Math.pow(10, -3.49 + 3.191 * Math.log10(size)); },
                costPerLb: 6,
                expPerLb: 6
            },
            'northern_pike': {
                link: 'https://en.wikipedia.org/wiki/Northern_pike',
                image: 'https://en.wikipedia.org/wiki/Northern_pike#/media/File:Esox_lucius1.jpg',
                type: 'freshwater',
                time: 'dawn/dusk',
                minSize: 16,
                maxSize: 55,
                weightFunc: function(size) { return Math.pow(10, -3.727 + 3.059 * Math.log10(size)); },
                costPerLb: 4.7,
                expPerLb: 4
            },
            'muskellunge': {
                link: 'https://en.wikipedia.org/wiki/Muskellunge',
                image: 'https://en.wikipedia.org/wiki/Muskellunge#/media/File:Esox_masquinongyeditcrop.jpg',
                type: 'freshwater',
                time: 'night',
                minSize: 28,
                maxSize: 72,
                weightFunc: function(size) { return Math.pow(10, -4.126 + 3.337 * Math.log10(size)); },
                costPerLb: 4.7,
                expPerLb: 4
            },
            'black_crappie': {
                link: 'https://en.wikipedia.org/wiki/Black_crappie',
                image: 'https://en.wikipedia.org/wiki/Black_crappie#/media/File:Pomoxis_nigromaculatus1.jpg',
                type: 'freshwater',
                time: 'night',
                minSize: 4,
                maxSize: 19,
                weightFunc: function(size) { return Math.pow(10, -4.126-3.576 + 3.345 * Math.log10(size)); },
                costPerLb: 8,
                expPerLb: 8
            },
            'common_carp': {
                // link: '',
                // image: '',
                // type: '',
                // time: '',
                // minSize: ,
                // maxSize: ,
                // weightFunc: function(size) { return ; },
                // costPerLb: ,
                // expPerLb: 
            },
            'yellow_perch': {

            },
            'longear_sunfish': {

            },
            'rock_bass': {

            },
            'buffalo': {

            },
            'bluegill': {

            },
            'flathead_catfish': {

            },
            'white_bass': {

            },
            'channel_catfish': {

            },
            'freshwater_drum': {

            },
            'white_crappie': {

            },
            'sturgeon': {

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
                costPerItem: 0.5,
                expPer: 1
            },
            'algae': {
                link: 'https://en.wikipedia.org/wiki/Algae',
                image: 'https://en.wikipedia.org/wiki/Algae#/media/File:NSW_seabed_1.JPG',
                type: 'item',
                time: 'all',
                minSize: 0.1,
                maxSize: 1,
                costPerItem: 0.01,
                expPer: 0
            },
            'bucket_hat': {
                link: 'https://en.wikipedia.org/wiki/Bucket_hat',
                image: 'https://en.wikipedia.org/wiki/Bucket_hat#/media/File:Wirksworth_MMB_01_Ecclesbourne_Valley_Railway_101XXX.jpg',
                type: 'item',
                time: 'all',
                minSize: 1,
                maxSize: 1,
                costPerItem: 0.75,
                expPer: 1
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