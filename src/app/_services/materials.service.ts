import { Injectable } from '@angular/core';

@Injectable()
export class MaterialsService {
  // public parts_substitutes: PartsSubs[];
  public parts_substitutes: any;

  public clario_grids = {
    '15/16': {
      '24x24': {
        name: '24x24in',
        units: 'inches',
        image_type: '24',
        tile_size_type: 'standard',
        tile_size: '24'
      },
      '24x48': {
        name: '24x48in',
        units: 'inches',
        image_type: '48',
        tile_size_type: 'standard',
        tile_size: '48'
      },
      '600x600': {
        name: '600x600mm',
        units: 'centimeters',
        image_type: '24',
        tile_size_type: 'metric',
        tile_size: '600'
      },
      '600x1200': {
        name: '600x1200mm',
        units: 'centimeters',
        image_type: '48',
        tile_size_type: 'metric',
        tile_size: '1200'
      },
      '625x625': {
        name: '625x625mm',
        units: 'centimeters',
        image_type: '24',
        tile_size_type: 'german',
        tile_size: '625'
      },
      '625x1250': {
        name: '625x1250mm',
        units: 'centimeters',
        image_type: '48',
        tile_size_type: 'german',
        tile_size: '1250'
      }
    },
    '9/16': {
      '24x24': {
        name: '24x24in',
        units: 'inches',
        image_type: '24',
        tile_size_type: 'standard',
        tile_size: '24'
      },
      '24x48': {
        name: '24x48in',
        units: 'inches',
        image_type: '48',
        tile_size_type: 'standard',
        tile_size: '48'
      }
    }
  };

  public seeyond_features: any = {
    '0': {
      feature_type: 0,
      name: 'linear-partition',
      title: 'Freestanding Linear Partition',
      image: '/assets/images/renderings/freestanding_linear_partition.png',
      width: 96,
      height: 72,
      angle: '',
      radius: '',
      ceiling_length: '',
      hardware: {
        '3-85-101': {},
        '3-15-0842': {},
        '3-85-105': {},
        '3-85-106': {},
        '3-85-102': {} // zipties
      }
    },
    '1': {
      name: 'curved-partition',
      title: 'Freestanding Curved Partition',
      image: '/assets/images/renderings/freestanding_curved_partition.png',
      width: 96,
      height: 72,
      radius: 60,
      angle: '',
      ceiling_length: '',
      hardware: {
        '3-85-101': {},
        '3-15-0842': {},
        '3-85-105': {},
        '3-85-106': {},
        '3-85-102': {} // zipties
      }
    },
    '2': {
      feature_type: 2,
      name: 'wall',
      title: 'Wall Feature',
      image: '/assets/images/renderings/wall.png',
      width: 32,
      height: 32,
      radius: '',
      angle: '',
      ceiling_length: '',
      hardware: {
        '3-85-101': {},
        '3-15-1606': {},
        '3-85-104': {},
        '3-85-109': {}
      }
    },
    '3': {
      feature_type: 3,
      name: 'wall-to-ceiling',
      title: 'Wall-to-Ceiling Feature',
      image: '/assets/images/renderings/wall_to_ceiling.png',
      width: 72,
      height: 96,
      angle: 90,
      radius: '',
      ceiling_length: 72,
      hardware: {
        '3-85-101': {},
        '3-15-1606': {},
        '3-85-104': {},
        '3-85-109': {},
        '3-85-107': {},
        '3-85-108': {},
        '3-85-105': {},
        '3-15-1674': {},
        '3-15-1675': {},
        '3-15-0842': {},
        '3-85-102': {} // zipties
      }
    },
    '4': {
      feature_type: 4,
      name: 'ceiling',
      title: 'Ceiling Feature',
      image: '/assets/images/renderings/ceiling.png',
      width: 50,
      height: 50,
      radius: '',
      angle: '',
      ceiling_length: '',
      hardware: {
        '3-85-101': {},
        '3-85-107': {},
        '3-85-108': {},
        '3-85-105': {},
        '3-15-1674': {},
        '3-15-1675': {},
        '3-15-0842': {},
        '3-85-102': {} // zipties
      }
    }
  };

  // 0 = court, 1 = cusp, 2 = kink, 3 = tilt, 4 = billow
  public seeyondPatternsArray = ['court', 'cusp', 'kink', 'tilt', 'billow'];

  public seeyondMinMaxDimensions = {
    0: {
      inches: {
        widthMin: 50,
        widthMax: 240,
        heightMin: 50,
        heightMax: 84,
        ceilLengthMin: null,
        ceilLengthMax: null,
        radiusMin: null,
        radiusMax: null
      },
      centimeters: {
        widthMin: 127,
        widthMax: 610,
        heightMin: 127,
        heightMax: 214,
        ceilLengthMin: null,
        ceilLengthMax: null,
        radiusMin: null,
        radiusMax: null
      }
    },
    1: {
      inches: {
        widthMin: 50,
        widthMax: 240,
        heightMin: 50,
        heightMax: 84,
        ceilLengthMin: null,
        ceilLengthMax: null,
        radiusMin: 30,
        radiusMax: 300
      },
      centimeters: {
        widthMin: 127,
        widthMax: 610,
        heightMin: 127,
        heightMax: 214,
        ceilLengthMin: null,
        ceilLengthMax: null,
        radiusMin: 77,
        radiusMax: 762
      }
    },
    2: {
      inches: {
        widthMin: 32,
        widthMax: 480,
        heightMin: 32,
        heightMax: 480,
        ceilLengthMin: null,
        ceilLengthMax: null,
        radiusMin: null,
        radiusMax: null
      },
      centimeters: {
        widthMin: 81,
        widthMax: 1220,
        heightMin: 81,
        heightMax: 1220,
        ceilLengthMin: null,
        ceilLengthMax: null,
        radiusMin: null,
        radiusMax: null
      }
    },
    3: {
      inches: {
        widthMin: 50,
        widthMax: 480,
        heightMin: 50,
        heightMax: 480,
        ceilLengthMin: 50,
        ceilLengthMax: 144,
        radiusMin: null,
        radiusMax: null
      },
      centimeters: {
        widthMin: 127,
        widthMax: 1220,
        heightMin: 127,
        heightMax: 1220,
        ceilLengthMin: 127,
        ceilLengthMax: 366,
        radiusMin: null,
        radiusMax: null
      }
    },
    4: {
      inches: {
        widthMin: 50,
        widthMax: 480,
        heightMin: 50,
        heightMax: 480,
        ceilLengthMin: null,
        ceilLengthMax: null,
        radiusMin: null,
        radiusMax: null
      },
      centimeters: {
        widthMin: 127,
        widthMax: 1220,
        heightMin: 127,
        heightMax: 1220,
        ceilLengthMin: null,
        ceilLengthMax: null,
        radiusMin: null,
        radiusMax: null
      }
    }
  };

  public toolsArray = ['rotate', 'remove', 'light', 'vent', 'sprinkler'];

  public tilesArray = {
    tetria: {
      0: {
        image: '/assets/images/tiles/01.png',
        tile: '01',
        tile_size: '01',
        name: '01'
      },
      1: {
        image: '/assets/images/tiles/02.png',
        tile: '02',
        tile_size: '02',
        name: '02'
      },
      2: {
        image: '/assets/images/tiles/03.png',
        tile: '03',
        tile_size: '03',
        name: '03'
      },
      3: {
        image: '/assets/images/tiles/00.png',
        tile: '00',
        tile_size: '00',
        name: '00'
      }
    },
    'clario-cloud': {
      0: {
        image: '/assets/images/tiles/01.png',
        tile: '01',
        tile_size: '01',
        name: '01'
      },
    },
    clario: {
      0: {
        image: '/assets/images/baffles/baffle_24_x_48.png',
        name: '24x48',
        tile: '48',
        tile_size: '48',
        tile_size_type: 'standard'
      },
      1: {
        image: '/assets/images/baffles/baffle_24_x_24.png',
        name: '24x24',
        tile: '24',
        tile_size: '24',
        tile_size_type: 'standard'
      },
      2: {
        image: '/assets/images/tiles/00.png',
        name: 'flat',
        tile: '00',
        tile_size: '00',
        tile_size_type: 'standard'
      },
      3: {
        image: '/assets/images/baffles/baffle_24_x_48.png',
        name: '600x1200',
        tile: '1200',
        tile_size: '48',
        tile_size_type: 'metric'
      },
      4: {
        image: '/assets/images/baffles/baffle_24_x_24.png',
        name: '600x600',
        tile: '600',
        tile_size: '24',
        tile_size_type: 'metric'
      },
      5: {
        image: '/assets/images/tiles/00.png',
        name: 'flat',
        tile: '00',
        tile_size: '00',
        tile_size_type: 'metric'
      },
      6: {
        image: '/assets/images/baffles/baffle_24_x_48.png',
        name: '625x1250',
        tile: '1250',
        tile_size: '48',
        tile_size_type: 'german'
      },
      7: {
        image: '/assets/images/baffles/baffle_24_x_24.png',
        name: '625x625',
        tile: '625',
        tile_size: '24',
        tile_size_type: 'german'
      },
      8: {
        image: '/assets/images/tiles/00.png',
        name: 'flat',
        tile: '00',
        tile_size: '00',
        tile_size_type: 'german'
      }
    },
    velo: {
      0: {
        image: '/assets/images/velo/concave.png',
        tile: 'concave',
        name: 'concave'
      },
      1: {
        image: '/assets/images/velo/convex.png',
        tile: 'convex',
        name: 'convex'
      }
    },
    hush: {
      0: {
        image: '/assets/images/tiles/hush-blocks/1-1-2.png',
        name: '1x1',
        tile: '1-1-2',
        tile_size: '1-1-2',
        tile_shape: 'square'
      },
      1: {
        image: '/assets/images/tiles/hush-blocks/1-2-2.png',
        name: '1x2',
        tile: '1-2-2',
        tile_size: '1-2-2',
        tile_shape: 'square'
      },
      2: {
        image: '/assets/images/tiles/hush-blocks/1-3-2.png',
        name: '1x3',
        tile: '1-3-2',
        tile_size: '1-3-2',
        tile_shape: 'square'
      },
      3: {
        image: '/assets/images/tiles/hush-blocks/1-4-2.png',
        name: '1x4',
        tile: '1-4-2',
        tile_size: '1-4-2',
        tile_shape: 'square'
      },
      4: {
        image: '/assets/images/tiles/hush-blocks/2-2-2.png',
        name: '2x2',
        tile: '2-2-2',
        tile_size: '2-2-2',
        tile_shape: 'square'
      },
      5: {
        image: '/assets/images/tiles/hush-blocks/2-2-2-t.png',
        name: '2x2 Triangle',
        tile: '2-2-2-t',
        tile_size: '2-2-2-t',
        tile_shape: 'triangle'
      }
    },
    hushSwoon: {
      0: {
        image: '/assets/images/tiles/hush-swoon.png',
        tile: 'hush-swoon',
        tile_size: '',
        name: 'Hush Swoon'
      }
    },
    profile: {
      swoon: {
        0: {
          image: '/assets/images/profile/swoon/standard-tile.png',
          tile: 'standard',
          tile_size: '',
          name: 'Standard'
        },
        1: {
          image: '/assets/images/profile/swoon/acoustic-tile.png',
          tile: 'acoustic',
          tile_size: '',
          name: 'Acoustic'
        },
        2: {
          image: '/assets/images/profile/swoon/chroma-tile.png',
          tile: 'chroma',
          tile_size: '',
          name: 'Chroma'
        }
      }
    }
  };

  public materials = {
    felt: {
      sola: {
        ruby: {
          material: 'ruby',
          image: '/assets/images/materials/felt/sola/ruby.png',
          status: 'active',
          available_until: '',
          name_str: 'Ruby',
          sheet_part_id: '0-51-916'
        },
        aries: {
          material: 'aries',
          image: '/assets/images/materials/felt/sola/aries.png',
          status: 'active',
          available_until: '',
          name_str: 'Aries',
          sheet_part_id: '0-51-917'
        },
        citrine: {
          material: 'citrine',
          image: '/assets/images/materials/felt/sola/citrine.png',
          status: 'active',
          available_until: '',
          name_str: 'Citrine',
          sheet_part_id: '0-51-918'
        },
        admiral: {
          material: 'admiral',
          image: '/assets/images/materials/felt/sola/admiral.png',
          status: 'active',
          available_until: '',
          name_str: 'Admiral',
          sheet_part_id: '0-51-920'
        },
        oxford: {
          material: 'oxford',
          image: '/assets/images/materials/felt/sola/oxford.png',
          status: 'active',
          available_until: '',
          name_str: 'Oxford',
          sheet_part_id: '0-51-919'
        },
        hunter: {
          material: 'hunter',
          image: '/assets/images/materials/felt/sola/hunter.png',
          status: 'active',
          available_until: '',
          name_str: 'Hunter',
          sheet_part_id: '0-51-921'
        },
        burnt_umber: {
          material: 'burnt_umber',
          image: '/assets/images/materials/felt/sola/burnt_umber.png',
          status: 'active',
          available_until: '',
          name_str: 'Burnt Umber',
          sheet_part_id: '0-51-930'
        },
        nickel: {
          material: 'nickel',
          image: '/assets/images/materials/felt/sola/nickel.png',
          status: 'active',
          available_until: '',
          name_str: 'Nickel',
          sheet_part_id: '0-51-926'
        },
        armor: {
          material: 'armor',
          image: '/assets/images/materials/felt/sola/armor.png',
          status: 'active',
          available_until: '',
          name_str: 'Armor',
          sheet_part_id: '0-51-924'
        },
        mineral: {
          material: 'mineral',
          image: '/assets/images/materials/felt/sola/mineral.png',
          status: 'active',
          available_until: '',
          name_str: 'Mineral',
          sheet_part_id: '0-51-923'
        },
        cast: {
          material: 'cast',
          image: '/assets/images/materials/felt/sola/cast.png',
          status: 'active',
          available_until: '',
          name_str: 'Cast',
          sheet_part_id: '0-51-929'
        },
        ebony: {
          material: 'ebony',
          image: '/assets/images/materials/felt/sola/ebony.png',
          status: 'active',
          available_until: '',
          name_str: 'Ebony',
          sheet_part_id: '0-51-927'
        },
        cashmere: {
          material: 'cashmere',
          image: '/assets/images/materials/felt/sola/cashmere.png',
          status: 'active',
          available_until: '',
          name_str: 'Cashmere',
          sheet_part_id: '0-51-928'
        },
        moon: {
          material: 'moon',
          image: '/assets/images/materials/felt/sola/moon.png',
          status: 'active',
          available_until: '',
          name_str: 'Moon',
          sheet_part_id: '0-51-922'
        },
        zinc: {
          material: 'zinc',
          image: '/assets/images/materials/felt/sola/zinc.png',
          status: 'active',
          available_until: '',
          name_str: 'Zinc',
          sheet_part_id: '0-51-925'
        },
        ore: {
          material: 'ore',
          image: '/assets/images/materials/felt/sola/ore.png',
          status: 'discontinued',
          available_until: 'March 2019',
          name_str: 'Ore',
          sheet_part_id: '0-51-802'
        },
        dark_gray: {
          material: 'dark_gray',
          image: '/assets/images/materials/felt/sola/dark_gray.png',
          status: 'discontinued',
          available_until: 'March 2019',
          name_str: 'Dark Gray',
          sheet_part_id: '0-51-801'
        }
      },
      merino: {
        0: {
          material: 'milky-white',
          image: '/assets/images/materials/felt/merino/milky-white.png',
          hex: '#dfdee0',
          status: 'active',
          name_str: 'Milky White',
          availableUntil: '',
          partId: ''
        },
        1: {
          material: 'heather-gray',
          image: '/assets/images/materials/felt/merino/heather-gray.png',
          hex: '#babbbe',
          status: 'active',
          name_str: 'Heather Gray',
          availableUntil: '',
          partId: ''
        },
        2: {
          material: 'charcoal',
          image: '/assets/images/materials/felt/merino/charcoal.png',
          hex: '#445062',
          status: 'active',
          name_str: 'Charcoal',
          availableUntil: '',
          partId: ''
        },
        3: {
          material: 'heather-charcoal',
          image: '/assets/images/materials/felt/merino/heather-charcoal.png',
          hex: '#5e616d',
          status: 'active',
          name_str: 'Heather Charcoal',
          availableUntil: '',
          partId: ''
        },
        4: {
          material: 'heather-black',
          image: '/assets/images/materials/felt/merino/heather-black.png',
          hex: '#353542',
          status: 'active',
          name_str: 'Heather Black',
          availableUntil: '',
          partId: ''
        },
        5: {
          material: 'black',
          image: '/assets/images/materials/felt/merino/black.png',
          hex: '#20232d',
          status: 'active',
          name_str: 'Black',
          availableUntil: '',
          partId: ''
        },
        6: {
          material: 'taupe',
          image: '/assets/images/materials/felt/merino/taupe.png',
          hex: '#b7a7a3',
          status: 'active',
          name_str: 'Taupe',
          availableUntil: '',
          partId: ''
        },
        7: {
          material: 'heather-taupe',
          image: '/assets/images/materials/felt/merino/heather-taupe.png',
          hex: '#b3aaa4',
          status: 'active',
          name_str: 'Heather Taupe',
          availableUntil: '',
          partId: ''
        },
        8: {
          material: 'putty',
          image: '/assets/images/materials/felt/merino/putty.png',
          hex: '#8e7476',
          status: 'active',
          name_str: 'Putty',
          availableUntil: '',
          partId: ''
        },
        9: {
          material: 'latte',
          image: '/assets/images/materials/felt/merino/latte.png',
          hex: '#a15532',
          status: 'active',
          name_str: 'Latte',
          availableUntil: '',
          partId: ''
        },
        10: {
          material: 'heather-dark-brown',
          image: '/assets/images/materials/felt/merino/heather-dark-brown.png',
          hex: '#54393a',
          status: 'active',
          name_str: 'Heather Dark Brown',
          availableUntil: '',
          partId: ''
        },
        11: {
          material: 'dark-brown',
          image: '/assets/images/materials/felt/merino/dark-brown.png',
          hex: '#382228',
          status: 'active',
          name_str: 'Dark Brown',
          availableUntil: '',
          partId: ''
        },
        12: {
          material: 'red',
          image: '/assets/images/materials/felt/merino/red.png',
          hex: '#e20000',
          status: 'active',
          name_str: 'Red',
          availableUntil: '',
          partId: ''
        },
        13: {
          material: 'crimson',
          image: '/assets/images/materials/felt/merino/crimson.png',
          hex: '#bf001f',
          status: 'active',
          name_str: 'Crimson',
          availableUntil: '',
          partId: ''
        },
        14: {
          material: 'bordeaux',
          image: '/assets/images/materials/felt/merino/bordeaux.png',
          hex: '#700229',
          status: 'active',
          name_str: 'Bordeaux',
          availableUntil: '',
          partId: ''
        },
        15: {
          material: 'raspberry-jam',
          image: '/assets/images/materials/felt/merino/raspberry-jam.png',
          hex: '#bb0058',
          status: 'active',
          name_str: 'Raspberry Jam',
          availableUntil: '',
          partId: ''
        },
        16: {
          material: 'royal-purple',
          image: '/assets/images/materials/felt/merino/royal-purple.png',
          hex: '#481a6d',
          status: 'active',
          name_str: 'Royal Purple',
          availableUntil: '',
          partId: ''
        },
        17: {
          material: 'midnight-blue',
          image: '/assets/images/materials/felt/merino/midnight-blue.png',
          hex: '#22234e',
          status: 'active',
          name_str: 'Midnight Blue',
          availableUntil: '',
          partId: ''
        },
        18: {
          material: 'peacock',
          image: '/assets/images/materials/felt/merino/peacock.png',
          hex: '#003363',
          status: 'active',
          name_str: 'Peacock',
          availableUntil: '',
          partId: ''
        },
        19: {
          material: 'liberty-blue',
          image: '/assets/images/materials/felt/merino/liberty-blue.png',
          hex: '#005db0',
          status: 'active',
          name_str: 'Liberty',
          availableUntil: '',
          partId: ''
        },
        20: {
          material: 'deep-turquoise',
          image: '/assets/images/materials/felt/merino/deep-turquoise.png',
          hex: '#006ecb',
          status: 'active',
          name_str: 'Deep',
          availableUntil: '',
          partId: ''
        },
        21: {
          material: 'platinum',
          image: '/assets/images/materials/felt/merino/platinum.png',
          hex: '#8a95a6',
          status: 'active',
          name_str: 'Platinum',
          availableUntil: '',
          partId: ''
        },
        22: {
          material: 'sky-blue',
          image: '/assets/images/materials/felt/merino/sky-blue.png',
          hex: '#01a5d4',
          status: 'active',
          name_str: 'Sky',
          availableUntil: '',
          partId: ''
        },
        23: {
          material: 'teal',
          image: '/assets/images/materials/felt/merino/teal.png',
          hex: '#00a494',
          status: 'active',
          name_str: 'Teal',
          availableUntil: '',
          partId: ''
        },
        24: {
          material: 'hunter-green',
          image: '/assets/images/materials/felt/merino/hunter-green.png',
          hex: '#003b39',
          status: 'active',
          name_str: 'Hunter',
          availableUntil: '',
          partId: ''
        },
        25: {
          material: 'avocado',
          image: '/assets/images/materials/felt/merino/avocado.png',
          hex: '#778a00',
          status: 'active',
          name_str: 'Avocado',
          availableUntil: '',
          partId: ''
        },
        26: {
          material: 'clover-green',
          image: '/assets/images/materials/felt/merino/clover-green.png',
          hex: '#019a00',
          status: 'active',
          name_str: 'Clover',
          availableUntil: '',
          partId: ''
        },
        27: {
          material: 'goldenrod',
          image: '/assets/images/materials/felt/merino/goldenrod.png',
          hex: '#ffb300',
          status: 'active',
          name_str: 'Goldenrod',
          availableUntil: '',
          partId: ''
        },
        28: {
          material: 'camel',
          image: '/assets/images/materials/felt/merino/camel.png',
          hex: '#dfa77b',
          status: 'active',
          name_str: 'Camel',
          availableUntil: '',
          partId: ''
        },
        29: {
          material: 'orange',
          image: '/assets/images/materials/felt/merino/orange.png',
          hex: '#ff6c00',
          status: 'active',
          name_str: 'Orange',
          availableUntil: '',
          partId: ''
        }
      }
    },
    varia: {
      color: {
        0: { material: 'bashful_r10', hex: '#E2A494', status: 'discontinued', availableUntil: '', partId: 9841 },
        1: { material: 'coral_r11', hex: '#EDCAB3', status: 'active', availableUntil: '', partId: 1537 },
        2: { material: 'cosmetic_r12', hex: '#EED0B9', status: 'active', availableUntil: '', partId: 9876 },
        3: { material: 'nude_r13', hex: '#F4E2C9', status: 'active', availableUntil: '', partId: 9962 },
        4: { material: 'ginger_r14', hex: '#EDC19F', status: 'active', availableUntil: '', partId: 9909 },
        5: { material: 'salmon_r15', hex: '#E4A786', status: 'active', availableUntil: '', partId: 9988 },
        6: { material: 'sherbet_r16', hex: '#D2663F', status: 'active', availableUntil: '', partId: 9995 },
        7: { material: 'cranberry_r17', hex: '#C72F1D', status: 'active', availableUntil: '', partId: 1012 },
        8: { material: 'love_r18', hex: '#C5221C', status: 'active', availableUntil: '', partId: 9945 },
        9: { material: 'jello_r19', hex: '#BB241C', status: 'active', availableUntil: '', partId: 9928 },
        10: { material: 'gypsy_r20', hex: '#B03F1F', status: 'active', availableUntil: '', partId: 9917 },
        11: { material: 'strawberry_r21', hex: '#8D241E', status: 'active', availableUntil: '', partId: 10004 },
        12: { material: 'garnet_r22', hex: '#852426', status: 'active', availableUntil: '', partId: 9908 },
        13: { material: 'desire_r23', hex: '#922822', status: 'active', availableUntil: '', partId: 9889 },
        14: { material: 'radish_r24', hex: '#A72020', status: 'active', availableUntil: '', partId: 9977 },
        15: { material: 'sweetheart_r25', hex: '#A32023', status: 'active', availableUntil: '', partId: 10010 },
        16: { material: 'daredevil_r26', hex: '#B12020', status: 'active', availableUntil: '', partId: 9885 },
        17: { material: 'spunky_r27', hex: '#C32920', status: 'active', availableUntil: '', partId: 10002 },
        18: { material: 'rouge_r28', hex: '#BD2225', status: 'active', availableUntil: '', partId: 9986 },
        19: { material: 'gladiola_r29', hex: '#CB7177', status: 'active', availableUntil: '', partId: 9911 },
        20: { material: 'peony_r30', hex: '#E4C1BB', status: 'active', availableUntil: '', partId: 9967 },
        21: { material: 'petal_r31', hex: '#EAD2D3', status: 'active', availableUntil: '', partId: 1536 },
        22: { material: 'powder_puff_r32', hex: '#F0E5E2', status: 'active', availableUntil: '', partId: 10037 },
        23: { material: 'azalea_r33', hex: '#EAD4C8', status: 'active', availableUntil: '', partId: 9840 },
        24: { material: 'begonia_r34', hex: '#E8B6B0', status: 'active', availableUntil: '', partId: 9845 },
        25: { material: 'watermelon_r35', hex: '#DC8B8F', status: 'active', availableUntil: '', partId: 10027 },
        26: { material: 'dragon_fruit_r36', hex: '#D46C74', status: 'active', availableUntil: '', partId: 9893 },
        27: { material: 'pomegranate_r37', hex: '#A1382E', status: 'active', availableUntil: '', partId: 445 },
        28: { material: 'beet_r38', hex: '#67242A', status: 'active', availableUntil: '', partId: 9844 },
        29: { material: 'merlot_r39', hex: '#451A2E', status: 'active', availableUntil: '', partId: 9952 },
        30: { material: 'clementine_o07', hex: '#E09A20', status: 'active', availableUntil: '', partId: 9871 },
        31: { material: 'carnival_o08', hex: '#D98022', status: 'active', availableUntil: '', partId: 9858 },
        32: { material: 'oj_o09', hex: '#DC8B21', status: 'active', availableUntil: '', partId: 456 },
        33: { material: 'festive_o10', hex: '#CF5F20', status: 'active', availableUntil: '', partId: 9901 },
        34: { material: 'chipotle_o11', hex: '#BF5721', status: 'active', availableUntil: '', partId: 9865 },
        35: { material: 'persimmon_o12', hex: '#CE5820', status: 'active', availableUntil: '', partId: 446 },
        36: { material: 'jubilee_o13', hex: '#D7792B', status: 'active', availableUntil: '', partId: 9931 },
        37: { material: 'charmer_o14', hex: '#DF963B', status: 'active', availableUntil: '', partId: 9864 },
        38: { material: 'butternut_o15', hex: '#DF9620', status: 'active', availableUntil: '', partId: 9853 },
        39: { material: 'giraffe_o16', hex: '#C9992B', status: 'active', availableUntil: '', partId: 9910 },
        40: { material: 'curry_o17', hex: '#CE8827', status: 'active', availableUntil: '', partId: 447 },
        41: { material: 'marmalade_o18', hex: '#D5994A', status: 'active', availableUntil: '', partId: 1665 },
        42: { material: 'shrimp_o19', hex: '#EDC28D', status: 'active', availableUntil: '', partId: 9997 },
        43: { material: 'mai_tai_o20', hex: '#DB8549', status: 'active', availableUntil: '', partId: 659 },
        44: { material: 'punch_o21', hex: '#D67242', status: 'active', availableUntil: '', partId: 9976 },
        45: { material: 'paprika_o22', hex: '#B3381D', status: 'active', availableUntil: '', partId: 9965 },
        46: { material: 'butterscotch_y06', hex: '#CFAE61', status: 'active', availableUntil: '', partId: 9854 },
        47: { material: 'couscous_y07', hex: '#EBCD76', status: 'active', availableUntil: '', partId: 9878 },
        48: { material: 'gardenia_y08', hex: '#EEDB9F', status: 'active', availableUntil: '', partId: 9907 },
        49: { material: 'morning_y09', hex: '#F9EFC0', status: 'active', availableUntil: '', partId: 9956 },
        50: { material: 'daffodil_y10', hex: '#F3E6A4', status: 'active', availableUntil: '', partId: 9882 },
        51: { material: 'vitamin_c_y11', hex: '#F4E088', status: 'active', availableUntil: '', partId: 1142 },
        52: { material: 'taxicab_y12', hex: '#F0D059', status: 'active', availableUntil: '', partId: 10015 },
        53: { material: 'golden_y13', hex: '#DEC046', status: 'active', availableUntil: '', partId: 9913 },
        54: { material: 'squash_y14', hex: '#EDC742', status: 'active', availableUntil: '', partId: 10003 },
        55: { material: 'tiger_y15', hex: '#EAB51D', status: 'active', availableUntil: '', partId: 10019 },
        56: { material: 'pharaoh_y16', hex: '#EEC421', status: 'active', availableUntil: '', partId: 9969 },
        57: { material: 'sunnyside_y17', hex: '#F1CA45', status: 'active', availableUntil: '', partId: 10005 },
        58: { material: 'butter_y18', hex: '#F4E77E', status: 'active', availableUntil: '', partId: 9852 },
        59: { material: 'daisy_y19', hex: '#F1DD3A', status: 'active', availableUntil: '', partId: 9884 },
        60: { material: 'chirp_y20', hex: '#F4E445', status: 'active', availableUntil: '', partId: 9866 },
        61: { material: 'marigold_y21', hex: '#F4EC90', status: 'active', availableUntil: '', partId: 661 },
        62: { material: 'springtime_y22', hex: '#F6F3B7', status: 'active', availableUntil: '', partId: 10001 },
        63: { material: 'camel_y23', hex: '#EBE2A0', status: 'active', availableUntil: '', partId: 656 },
        64: { material: 'wafer_y24', hex: '#DDCD8C', status: 'active', availableUntil: '', partId: 10025 },
        65: { material: 'cider_y25', hex: '#CEBC6F', status: 'active', availableUntil: '', partId: 9867 },
        66: { material: 'syrup_y26', hex: '#907135', status: 'active', availableUntil: '', partId: 10011 },
        67: { material: 'glazed_g15', hex: '#EBEAD4', status: 'active', availableUntil: '', partId: 9912 },
        68: { material: 'pickle_g16', hex: '#EBE9C8', status: 'active', availableUntil: '', partId: 9970 },
        69: { material: 'lark_g17', hex: '#E2E1C5', status: 'active', availableUntil: '', partId: 9936 },
        70: { material: 'pear_g18', hex: '#E6E8D3', status: 'active', availableUntil: '', partId: 9966 },
        71: { material: 'cucumber_g19', hex: '#E4E7CC', status: 'active', availableUntil: '', partId: 9880 },
        72: { material: 'nomad_g20', hex: '#CECDB6', status: 'active', availableUntil: '', partId: 9961 },
        73: { material: 'chai_g21', hex: '#736633', status: 'active', availableUntil: '', partId: 9863 },
        74: { material: 'terrace_g22', hex: '#A99B5C', status: 'active', availableUntil: '', partId: 10017 },
        75: { material: 'swamp_g23', hex: '#BFB98A', status: 'active', availableUntil: '', partId: 10007 },
        76: { material: 'hickory_g24', hex: '#C4B944', status: 'active', availableUntil: '', partId: 9922 },
        77: { material: 'vegan_g25', hex: '#C9C641', status: 'active', availableUntil: '', partId: 10023 },
        78: { material: 'citron_g26', hex: '#DFDB54', status: 'active', availableUntil: '', partId: 9869 },
        79: { material: 'acre_g27', hex: '#C2CC54', status: 'active', availableUntil: '', partId: 9830 },
        80: { material: 'turtle_g28', hex: '#BACE4D', status: 'active', availableUntil: '', partId: 10022 },
        81: { material: 'guacamole_g29', hex: '#DDE187', status: 'active', availableUntil: '', partId: 9915 },
        82: { material: 'minnow_g30', hex: '#D9E3C3', status: 'active', availableUntil: '', partId: 9954 },
        83: { material: 'garden_g31', hex: '#E8EAA1', status: 'active', availableUntil: '', partId: 9906 },
        84: { material: 'sweet_pea_g32', hex: '#E6E99D', status: 'active', availableUntil: '', partId: 10009 },
        85: { material: 'moss_g33', hex: '#CBD58A', status: 'active', availableUntil: '', partId: 1145 },
        86: { material: 'marsh_g34', hex: '#B9C583', status: 'active', availableUntil: '', partId: 439 },
        87: { material: 'rainforest_g35', hex: '#9AA26A', status: 'active', availableUntil: '', partId: 9979 },
        88: { material: 'basil_g36', hex: '#94A551', status: 'active', availableUntil: '', partId: 9842 },
        89: { material: 'apple_g37', hex: '#B3CA86', status: 'active', availableUntil: '', partId: 9836 },
        90: { material: 'rosemary_g38', hex: '#CDD498', status: 'active', availableUntil: '', partId: 9985 },
        91: { material: 'laurel_g39', hex: '#89AE6F', status: 'active', availableUntil: '', partId: 9937 },
        92: { material: 'cilantro_g40', hex: '#63924A', status: 'active', availableUntil: '', partId: 9868 },
        93: { material: 'tropical_g41', hex: '#6FAE45', status: 'active', availableUntil: '', partId: 10021 },
        94: { material: 'lawn_g42', hex: '#AECB76', status: 'active', availableUntil: '', partId: 460 },
        95: { material: 'thyme_g43', hex: '#C8DA90', status: 'active', availableUntil: '', partId: 10018 },
        96: { material: 'zucchini_g44', hex: '#CBDCA5', status: 'active', availableUntil: '', partId: 10034 },
        97: { material: 'rivulet_g45', hex: '#9BB89E', status: 'active', availableUntil: '', partId: 9981 },
        98: { material: 'oregano_g46', hex: '#89B18C', status: 'active', availableUntil: '', partId: 9963 },
        99: { material: 'shamrock_g47', hex: '#65AF81', status: 'active', availableUntil: '', partId: 9994 },
        100: { material: 'lucky_g48', hex: '#5B957D', status: 'active', availableUntil: '', partId: 9946 },
        101: { material: 'isle_g49', hex: '#6B887A', status: 'active', availableUntil: '', partId: 9925 },
        102: { material: 'seine_g50', hex: '#98C8BC', status: 'active', availableUntil: '', partId: 9992 },
        103: { material: 'awash_g51', hex: '#CDE0CE', status: 'active', availableUntil: '', partId: 9839 },
        104: { material: 'pixie_g52', hex: '#9AC9C1', status: 'active', availableUntil: '', partId: 9972 },
        105: { material: 'capri_g53', hex: '#67B3AB', status: 'active', availableUntil: '', partId: 9857 },
        106: { material: 'persian_g54', hex: '#53AB9C', status: 'active', availableUntil: '', partId: 9968 },
        107: { material: 'kilt_g55', hex: '#30A08D', status: 'active', availableUntil: '', partId: 9933 },
        108: { material: 'emperor_g56', hex: '#51927D', status: 'active', availableUntil: '', partId: 9898 },
        109: { material: 'julep_g57', hex: '#72B594', status: 'active', availableUntil: '', partId: 9932 },
        110: { material: 'eden_g58', hex: '#CADEB4', status: 'active', availableUntil: '', partId: 9896 },
        111: { material: 'jardin_g59', hex: '#DBE9DE', status: 'active', availableUntil: '', partId: 9927 },
        112: { material: 'aloe_g60', hex: '#E9ECDD', status: 'active', availableUntil: '', partId: 451 },
        113: { material: 'sapling_g61', hex: '#DAE1C6', status: 'active', availableUntil: '', partId: 9990 },
        114: { material: 'wintergreen_g62', hex: '#DCE4C6', status: 'active', availableUntil: '', partId: 10029 },
        115: { material: 'copen_g63', hex: '#E5EACA', status: 'active', availableUntil: '', partId: 9874 },
        116: { material: 'jewel_b11', hex: '#3D6F6C', status: 'active', availableUntil: '', partId: 9929 },
        117: { material: 'saltwater_b12', hex: '#35747F', status: 'active', availableUntil: '', partId: 9989 },
        118: { material: 'venice_b13', hex: '#4DABB2', status: 'active', availableUntil: '', partId: 10024 },
        119: { material: 'sea_b14', hex: '#9AC9C1', status: 'active', availableUntil: '', partId: 1143 },
        120: { material: 'cayman_b15', hex: '#B0D5D5', status: 'active', availableUntil: '', partId: 9862 },
        121: { material: 'swan_dive_b16', hex: '#BCDAD6', status: 'active', availableUntil: '', partId: 10008 },
        122: { material: 'heron_b17', hex: '#D2E5E6', status: 'active', availableUntil: '', partId: 9920 },
        123: { material: 'reef_b18', hex: '#DDE9E6', status: 'active', availableUntil: '', partId: 499 },
        124: { material: 'seahorse_b19', hex: '#E9F2EC', status: 'active', availableUntil: '', partId: 9991 },
        125: { material: 'buoyant_b20', hex: '#DBEAE0', status: 'active', availableUntil: '', partId: 9851 },
        126: { material: 'cruise_b21', hex: '#94C9DA', status: 'active', availableUntil: '', partId: 9879 },
        127: { material: 'poseidon_b22', hex: '#5EABC2', status: 'active', availableUntil: '', partId: 9974 },
        128: { material: 'calypso_b23', hex: '#2288B1', status: 'active', availableUntil: '', partId: 9856 },
        129: { material: 'matisse_b24', hex: '#469ACF', status: 'active', availableUntil: '', partId: 9949 },
        130: { material: 'cobalt_b25', hex: '#4C8FCC', status: 'active', availableUntil: '', partId: 1010 },
        131: { material: 'cassidy_b26', hex: '#396BAF', status: 'active', availableUntil: '', partId: 9859 },
        132: { material: 'catalina_b27', hex: '#2C5BA2', status: 'active', availableUntil: '', partId: 9860 },
        133: { material: 'dory_b28', hex: '#1C6EAE', status: 'active', availableUntil: '', partId: 9892 },
        134: { material: 'lapis_b29', hex: '#1D5B99', status: 'active', availableUntil: '', partId: 9935 },
        135: { material: 'wizard_b30', hex: '#2F4A70', status: 'active', availableUntil: '', partId: 10030 },
        136: { material: 'denim_b31', hex: '#628CAF', status: 'active', availableUntil: '', partId: 9888 },
        137: { material: 'harbor_b32', hex: '#5A94AF', status: 'active', availableUntil: '', partId: 9918 },
        138: { material: 'mariner_b33', hex: '#7C9FA6', status: 'active', availableUntil: '', partId: 9948 },
        139: { material: 'loch_b34', hex: '#8DA6AA', status: 'active', availableUntil: '', partId: 9943 },
        140: { material: 'atlantic_b35', hex: '#89AAB9', status: 'active', availableUntil: '', partId: 653 },
        141: { material: 'raindrop_b36', hex: '#97C3DB', status: 'active', availableUntil: '', partId: 9978 },
        142: { material: 'shoreline_b37', hex: '#7EC0DC', status: 'active', availableUntil: '', partId: 9996 },
        143: { material: 'surf_b38', hex: '#BBDCE9', status: 'active', availableUntil: '', partId: 449 },
        144: { material: 'robin_b39', hex: '#D3E7EF', status: 'active', availableUntil: '', partId: 9983 },
        145: { material: 'tide_b40', hex: '#E3EDF3', status: 'active', availableUntil: '', partId: 500 },
        146: { material: 'aviator_b41', hex: '#DAE3E7', status: 'active', availableUntil: '', partId: 9838 },
        147: { material: 'cloudless_b42', hex: '#DEEAF4', status: 'active', availableUntil: '', partId: 9872 },
        148: { material: 'fountain_b43', hex: '#B3D6ED', status: 'active', availableUntil: '', partId: 9904 },
        149: { material: 'flood_b44', hex: '#A1CDEA', status: 'active', availableUntil: '', partId: 1534 },
        150: { material: 'pier_b45', hex: '#77B0E1', status: 'active', availableUntil: '', partId: 9971 },
        151: { material: 'cornflower_b46', hex: '#92C4ED', status: 'active', availableUntil: '', partId: 9875 },
        152: { material: 'lago_b47', hex: '#ACCFEE', status: 'active', availableUntil: '', partId: 9934 },
        153: { material: 'skydive_b48', hex: '#C0DBF2', status: 'active', availableUntil: '', partId: 9998 },
        154: { material: 'bliss_b49', hex: '#C0D6EF', status: 'active', availableUntil: '', partId: 461 },
        155: { material: 'daydream_b50', hex: '#B0C6DF', status: 'active', availableUntil: '', partId: 9887 },
        156: { material: 'bay_b51', hex: '#87A3C4', status: 'active', availableUntil: '', partId: 9843 },
        157: { material: 'midnight_b52', hex: '#80A4D6', status: 'active', availableUntil: '', partId: 1146 },
        158: { material: 'tahoe_b53', hex: '#436FB2', status: 'active', availableUntil: '', partId: 10013 },
        159: { material: 'nautical_b54', hex: '#4D73A5', status: 'active', availableUntil: '', partId: 9958 },
        160: { material: 'cadet_b55', hex: '#627EA4', status: 'active', availableUntil: '', partId: 9855 },
        161: { material: 'moonstone_b56', hex: '#738FB7', status: 'active', availableUntil: '', partId: 9955 },
        162: { material: 'sparta_b57', hex: '#849ACD', status: 'active', availableUntil: '', partId: 10000 },
        163: { material: 'atlas_b58', hex: '#5D78B7', status: 'active', availableUntil: '', partId: 9837 },
        164: { material: 'hyacinth_b59', hex: '#5B72B2', status: 'active', availableUntil: '', partId: 9923 },
        165: { material: 'mythical_b60', hex: '#2B3C78', status: 'active', availableUntil: '', partId: 9957 },
        166: { material: 'bluejay_b61', hex: '#57678A', status: 'active', availableUntil: '', partId: 9848 },
        167: { material: 'monsoon_b62', hex: '#5B6E80', status: 'active', availableUntil: '', partId: 443 },
        168: { material: 'overcast_b63', hex: '#425559', status: 'active', availableUntil: '', partId: 9964 },
        169: { material: 'majesty_v03', hex: '#383048', status: 'active', availableUntil: '', partId: 9947 },
        170: { material: 'amethyst_v04', hex: '#5C599D', status: 'active', availableUntil: '', partId: 9834 },
        171: { material: 'dahlia_v05', hex: '#8289BF', status: 'active', availableUntil: '', partId: 9883 },
        172: { material: 'lavender_v06', hex: '#8B8EAB', status: 'active', availableUntil: '', partId: 9938 },
        173: { material: 'violet_v07', hex: '#B2B8DA', status: 'active', availableUntil: '', partId: 657 },
        174: { material: 'dawn_v08', hex: '#BDBFDF', status: 'active', availableUntil: '', partId: 9886 },
        175: { material: 'lilac_v09', hex: '#B9B1C8', status: 'active', availableUntil: '', partId: 9940 },
        176: { material: 'boulevard_v10', hex: '#AF9BBA', status: 'active', availableUntil: '', partId: 9850 },
        177: { material: 'iris_v11', hex: '#775B88', status: 'active', availableUntil: '', partId: 9924 },
        178: { material: 'prince_v12', hex: '#732674', status: 'active', availableUntil: '', partId: 9975 },
        179: { material: 'bewitched_v13', hex: '#A57D99', status: 'active', availableUntil: '', partId: 452 },
        180: { material: 'aphrodite_v14', hex: '#B57AA9', status: 'active', availableUntil: '', partId: 9835 },
        181: { material: 'lollipop_v15', hex: '#D9B3D1', status: 'active', availableUntil: '', partId: 9944 },
        182: { material: 'lily_v16', hex: '#E9D9E3', status: 'active', availableUntil: '', partId: 9941 },
        183: { material: 'cosmo_v17', hex: '#F0DAE8', status: 'active', availableUntil: '', partId: 9877 },
        184: { material: 'cupid_v18', hex: '#E8BCD4', status: 'active', availableUntil: '', partId: 9881 },
        185: { material: 'flamingo_v19', hex: '#DC90B7', status: 'active', availableUntil: '', partId: 9903 },
        186: { material: 'sassy_v20', hex: '#DA85A3', status: 'active', availableUntil: '', partId: 458 },
        187: { material: 'dollhouse_v21', hex: '#D36D94', status: 'active', availableUntil: '', partId: 9891 },
        188: { material: 'tamale_v22', hex: '#C63139', status: 'active', availableUntil: '', partId: 10014 },
        189: { material: 'jam_v23', hex: '#C12C42', status: 'active', availableUntil: '', partId: 9926 },
        190: { material: 'hibiscus_v24', hex: '#B73248', status: 'active', availableUntil: '', partId: 9921 },
        191: { material: 'taffy_v25', hex: '#9D3151', status: 'active', availableUntil: '', partId: 10012 },
        192: { material: 'fig_v26', hex: '#4C1C3C', status: 'active', availableUntil: '', partId: 9902 },
        193: { material: 'bohemian_v27', hex: '#7A5A62', status: 'active', availableUntil: '', partId: 9849 },
        194: { material: 'gypsum_n06', hex: '#E9E5CF', status: 'active', availableUntil: '', partId: 9916 },
        195: { material: 'biscotti_n07', hex: '#EBE4D6', status: 'active', availableUntil: '', partId: 9846 },
        196: { material: 'sable_n08', hex: '#E0D4C5', status: 'active', availableUntil: '', partId: 508 },
        197: { material: 'toasted_n09', hex: '#EBE0C1', status: 'active', availableUntil: '', partId: 10020 },
        198: { material: 'melon_n10', hex: '#F0E0BB', status: 'active', availableUntil: '', partId: 9951 },
        199: { material: 'allyssa_n11', hex: '#ECDBBD', status: 'active', availableUntil: '', partId: 9832 },
        200: { material: 'nectar_n12', hex: '#EFE5CF', status: 'active', availableUntil: '', partId: 1538 },
        201: { material: 'glow_n13', hex: '#F9F4D8', status: 'active', availableUntil: '', partId: 496 },
        202: { material: 'lemon_n14', hex: '#F7F1C8', status: 'active', availableUntil: '', partId: 1535 },
        203: { material: 'sunrise_n15', hex: '#F3E7C6', status: 'active', availableUntil: '', partId: 10006 },
        204: { material: 'mellow_n16', hex: '#F4E7B5', status: 'active', availableUntil: '', partId: 9950 },
        205: { material: 'lioness_n17', hex: '#EFE3BF', status: 'active', availableUntil: '', partId: 9942 },
        206: { material: 'fawn_n18', hex: '#DFD0AD', status: 'active', availableUntil: '', partId: 9900 },
        207: { material: 'jicama_n19', hex: '#BEAA78', status: 'active', availableUntil: '', partId: 9930 },
        208: { material: 'almond_n20', hex: '#9A8A64', status: 'active', availableUntil: '', partId: 9833 },
        209: { material: 'saddle_n21', hex: '#9D7B55', status: 'active', availableUntil: '', partId: 9987 },
        210: { material: 'khaki_n22', hex: '#D3CAAB', status: 'active', availableUntil: '', partId: 503 },
        211: { material: 'oat_n23', hex: '#F0EEE4', status: 'active', availableUntil: '', partId: 505 },
        212: { material: 'dew_n24', hex: '#E5E4D1', status: 'active', availableUntil: '', partId: 9890 },
        213: { material: 'farmer_n25', hex: '#B5AA8C', status: 'active', availableUntil: '', partId: 9899 },
        214: { material: 'bittersweet_n26', hex: '#382B1E', status: 'active', availableUntil: '', partId: 9847 },
        215: { material: 'sepia_n27', hex: '#A4937A', status: 'active', availableUntil: '', partId: 9993 },
        216: { material: 'bark_n28', hex: '#8F6D4B', status: 'active', availableUntil: '', partId: 502 },
        217: { material: 'whiskey_n29', hex: '#985A28', status: 'active', availableUntil: '', partId: 10028 },
        218: { material: 'leather_n30', hex: '#532D1D', status: 'active', availableUntil: '', partId: 9939 },
        219: { material: 'redwood_n31', hex: '#AE7757', status: 'active', availableUntil: '', partId: 9980 },
        220: { material: 'blush_n32', hex: '#CAAA93', status: 'active', availableUntil: '', partId: 658 },
        221: { material: 'eggplant_n33', hex: '#A77F6E', status: 'active', availableUntil: '', partId: 654 },
        222: { material: 'teaberry_n34', hex: '#E9DEDB', status: 'active', availableUntil: '', partId: 10016 },
        223: { material: 'concord_n35', hex: '#AD9C9D', status: 'active', availableUntil: '', partId: 655 },
        224: { material: 'compass_n36', hex: '#ABA7A5', status: 'active', availableUntil: '', partId: 9873 },
        225: { material: 'smudge_n37', hex: '#C2C3C0', status: 'active', availableUntil: '', partId: 9999 },
        226: { material: 'zeppelin_n38', hex: '#8D8F91', status: 'active', availableUntil: '', partId: 10033 },
        227: { material: 'alley_n39', hex: '#4C4C53', status: 'active', availableUntil: '', partId: 9831 },
        228: { material: 'gotham_n40', hex: '#282C2E', status: 'active', availableUntil: '', partId: 9914 },
        229: { material: 'cauldron_n41', hex: '#485051', status: 'active', availableUntil: '', partId: 9861 },
        230: { material: 'drizzle_n42', hex: '#B4BDBA', status: 'active', availableUntil: '', partId: 9894 },
        231: { material: 'porpoise_n43', hex: '#C7C9C8', status: 'active', availableUntil: '', partId: 9973 },
        232: { material: 'wolf_n44', hex: '#BDC1C3', status: 'active', availableUntil: '', partId: 10031 },
        233: { material: 'cityscape_n45', hex: '#E3E6EA', status: 'active', availableUntil: '', partId: 9870 },
        234: { material: 'pond_n46', hex: '#EFF5F9', status: 'active', availableUntil: '', partId: 497 },
        235: { material: 'nebulous_n47', hex: '#F7F8F8', status: 'active', availableUntil: '', partId: 9959 },
        236: { material: 'helium_n48', hex: '#F3F4F3', status: 'active', availableUntil: '', partId: 9919 },
        237: { material: 'ash_n49', hex: '#E6E7E7', status: 'active', availableUntil: '', partId: 501 },
        238: { material: 'elephant_n50', hex: '#D9DADB', status: 'active', availableUntil: '', partId: 9897 },
        239: { material: 'thunder_n51', hex: '#D4D4D4', status: 'active', availableUntil: '', partId: 509 },
        240: { material: 'pewter_n52', hex: '#D7D6CF', status: 'active', availableUntil: '', partId: 506 },
        241: { material: 'rockport_n53', hex: '#E7E5DE', status: 'active', availableUntil: '', partId: 9984 },
        242: { material: 'roadside_n54', hex: '#D0CABB', status: 'active', availableUntil: '', partId: 9982 },
        243: { material: 'wren_n55', hex: '#CEC7B6', status: 'active', availableUntil: '', partId: 10032 },
        244: { material: 'warmstone_n56', hex: '#B6B0A3', status: 'active', availableUntil: '', partId: 10026 },
        245: { material: 'galvanize_n57', hex: '#988F89', status: 'active', availableUntil: '', partId: 9905 },
        246: { material: 'noir_n58', hex: '#6A675E', status: 'active', availableUntil: '', partId: 504 },
        247: { material: 'meteorite_n59', hex: '#4C4841', status: 'active', availableUntil: '', partId: 9953 },
        248: { material: 'nightshade_n60', hex: '#423A32', status: 'active', availableUntil: '', partId: 9960 },
        249: { material: 'dust_n61', hex: '#EBE8E4', status: 'active', availableUntil: '', partId: 9895 },
        250: { material: 'clear', hex: '#ffffff', status: 'active', availableUntil: '', partId: 464 }
      }
    },
    chroma: {
      color: {
        0: { material: 'bashful_r10', name_str: 'bashful_r10', image: '', hex: '#E2A494', status: 'active', availableUntil: '', partId: '' },
        1: { material: 'coral_r11', name_str: 'coral_r11', image: '', hex: '#EDCAB3', status: 'active', availableUntil: '', partId: '' },
        2: { material: 'cosmetic_r12', name_str: 'cosmetic_r12', image: '', hex: '#EED0B9', status: 'active', availableUntil: '', partId: '' },
        3: { material: 'nude_r13', name_str: 'nude_r13', image: '', hex: '#F4E2C9', status: 'active', availableUntil: '', partId: '' },
        4: { material: 'ginger_r14', name_str: 'ginger_r14', image: '', hex: '#EDC19F', status: 'active', availableUntil: '', partId: '' },
        5: { material: 'salmon_r15', name_str: 'salmon_r15', image: '', hex: '#E4A786', status: 'active', availableUntil: '', partId: '' },
        6: { material: 'sherbet_r16', name_str: 'sherbet_r16', image: '', hex: '#D2663F', status: 'active', availableUntil: '', partId: '' },
        7: { material: 'cranberry_r17', name_str: 'cranberry_r17', image: '', hex: '#C72F1D', status: 'active', availableUntil: '', partId: '' },
        8: { material: 'love_r18', name_str: 'love_r18', image: '', hex: '#C5221C', status: 'active', availableUntil: '', partId: '' },
        9: { material: 'jello_r19', name_str: 'jello_r19', image: '', hex: '#BB241C', status: 'active', availableUntil: '', partId: '' },
        10: { material: 'gypsy_r20', name_str: 'gypsy_r20', image: '', hex: '#B03F1F', status: 'active', availableUntil: '', partId: '' },
        11: { material: 'strawberry_r21', name_str: 'strawberry_r21', image: '', hex: '#8D241E', status: 'active', availableUntil: '', partId: '' },
        12: { material: 'garnet_r22', name_str: 'garnet_r22', image: '', hex: '#852426', status: 'active', availableUntil: '', partId: '' },
        13: { material: 'desire_r23', name_str: 'desire_r23', image: '', hex: '#922822', status: 'active', availableUntil: '', partId: '' },
        14: { material: 'radish_r24', name_str: 'radish_r24', image: '', hex: '#A72020', status: 'active', availableUntil: '', partId: '' },
        15: { material: 'sweetheart_r25', name_str: 'sweetheart_r25', image: '', hex: '#A32023', status: 'active', availableUntil: '', partId: '' },
        16: { material: 'daredevil_r26', name_str: 'daredevil_r26', image: '', hex: '#B12020', status: 'active', availableUntil: '', partId: '' },
        17: { material: 'spunky_r27', name_str: 'spunky_r27', image: '', hex: '#C32920', status: 'active', availableUntil: '', partId: '' },
        18: { material: 'rouge_r28', name_str: 'rouge_r28', image: '', hex: '#BD2225', status: 'active', availableUntil: '', partId: '' },
        19: { material: 'gladiola_r29', name_str: 'gladiola_r29', image: '', hex: '#CB7177', status: 'active', availableUntil: '', partId: '' },
        20: { material: 'peony_r30', name_str: 'peony_r30', image: '', hex: '#E4C1BB', status: 'active', availableUntil: '', partId: '' },
        21: { material: 'petal_r31', name_str: 'petal_r31', image: '', hex: '#EAD2D3', status: 'active', availableUntil: '', partId: '' },
        22: { material: 'powder_puff_r32', name_str: 'powder_puff_r32', image: '', hex: '#F0E5E2', status: 'active', availableUntil: '', partId: '' },
        23: { material: 'azalea_r33', name_str: 'azalea_r33', image: '', hex: '#EAD4C8', status: 'active', availableUntil: '', partId: '' },
        24: { material: 'begonia_r34', name_str: 'begonia_r34', image: '', hex: '#E8B6B0', status: 'active', availableUntil: '', partId: '' },
        25: { material: 'watermelon_r35', name_str: 'watermelon_r35', image: '', hex: '#DC8B8F', status: 'active', availableUntil: '', partId: '' },
        26: {
          material: 'dragon_fruit_r36',
          name_str: 'dragon_fruit_r36',
          image: '',
          hex: '#D46C74',
          status: 'active',
          availableUntil: '',
          partId: ''
        },
        27: { material: 'pomegranate_r37', name_str: 'pomegranate_r37', image: '', hex: '#A1382E', status: 'active', availableUntil: '', partId: '' },
        28: { material: 'beet_r38', name_str: 'beet_r38', image: '', hex: '#67242A', status: 'active', availableUntil: '', partId: '' },
        29: { material: 'merlot_r39', name_str: 'merlot_r39', image: '', hex: '#451A2E', status: 'active', availableUntil: '', partId: '' },
        30: { material: 'clementine_o07', name_str: 'clementine_o07', image: '', hex: '#E09A20', status: 'active', availableUntil: '', partId: '' },
        31: { material: 'carnival_o08', name_str: 'carnival_o08', image: '', hex: '#D98022', status: 'active', availableUntil: '', partId: '' },
        32: { material: 'oj_o09', name_str: 'oj_o09', image: '', hex: '#DC8B21', status: 'active', availableUntil: '', partId: '' },
        33: { material: 'festive_o10', name_str: 'festive_o10', image: '', hex: '#CF5F20', status: 'active', availableUntil: '', partId: '' },
        34: { material: 'chipotle_o11', name_str: 'chipotle_o11', image: '', hex: '#BF5721', status: 'active', availableUntil: '', partId: '' },
        35: { material: 'persimmon_o12', name_str: 'persimmon_o12', image: '', hex: '#CE5820', status: 'active', availableUntil: '', partId: '' },
        36: { material: 'jubilee_o13', name_str: 'jubilee_o13', image: '', hex: '#D7792B', status: 'active', availableUntil: '', partId: '' },
        37: { material: 'charmer_o14', name_str: 'charmer_o14', image: '', hex: '#DF963B', status: 'active', availableUntil: '', partId: '' },
        38: { material: 'butternut_o15', name_str: 'butternut_o15', image: '', hex: '#DF9620', status: 'active', availableUntil: '', partId: '' },
        39: { material: 'giraffe_o16', name_str: 'giraffe_o16', image: '', hex: '#C9992B', status: 'active', availableUntil: '', partId: '' },
        40: { material: 'curry_o17', name_str: 'curry_o17', image: '', hex: '#CE8827', status: 'active', availableUntil: '', partId: '' },
        41: { material: 'marmalade_o18', name_str: 'marmalade_o18', image: '', hex: '#D5994A', status: 'active', availableUntil: '', partId: '' },
        42: { material: 'shrimp_o19', name_str: 'shrimp_o19', image: '', hex: '#EDC28D', status: 'active', availableUntil: '', partId: '' },
        43: { material: 'mai_tai_o20', name_str: 'mai_tai_o20', image: '', hex: '#DB8549', status: 'active', availableUntil: '', partId: '' },
        44: { material: 'punch_o21', name_str: 'punch_o21', image: '', hex: '#D67242', status: 'active', availableUntil: '', partId: '' },
        45: { material: 'paprika_o22', name_str: 'paprika_o22', image: '', hex: '#B3381D', status: 'active', availableUntil: '', partId: '' },
        46: {
          material: 'butterscotch_y06',
          name_str: 'butterscotch_y06',
          image: '',
          hex: '#CFAE61',
          status: 'active',
          availableUntil: '',
          partId: ''
        },
        47: { material: 'couscous_y07', name_str: 'couscous_y07', image: '', hex: '#EBCD76', status: 'active', availableUntil: '', partId: '' },
        48: { material: 'gardenia_y08', name_str: 'gardenia_y08', image: '', hex: '#EEDB9F', status: 'active', availableUntil: '', partId: '' },
        49: { material: 'morning_y09', name_str: 'morning_y09', image: '', hex: '#F9EFC0', status: 'active', availableUntil: '', partId: '' },
        50: { material: 'daffodil_y10', name_str: 'daffodil_y10', image: '', hex: '#F3E6A4', status: 'active', availableUntil: '', partId: '' },
        51: { material: 'vitamin_c_y11', name_str: 'vitamin_c_y11', image: '', hex: '#F4E088', status: 'active', availableUntil: '', partId: '' },
        52: { material: 'taxicab_y12', name_str: 'taxicab_y12', image: '', hex: '#F0D059', status: 'active', availableUntil: '', partId: '' },
        53: { material: 'golden_y13', name_str: 'golden_y13', image: '', hex: '#DEC046', status: 'active', availableUntil: '', partId: '' },
        54: { material: 'squash_y14', name_str: 'squash_y14', image: '', hex: '#EDC742', status: 'active', availableUntil: '', partId: '' },
        55: { material: 'tiger_y15', name_str: 'tiger_y15', image: '', hex: '#EAB51D', status: 'active', availableUntil: '', partId: '' },
        56: { material: 'pharaoh_y16', name_str: 'pharaoh_y16', image: '', hex: '#EEC421', status: 'active', availableUntil: '', partId: '' },
        57: { material: 'sunnyside_y17', name_str: 'sunnyside_y17', image: '', hex: '#F1CA45', status: 'active', availableUntil: '', partId: '' },
        58: { material: 'butter_y18', name_str: 'butter_y18', image: '', hex: '#F4E77E', status: 'active', availableUntil: '', partId: '' },
        59: { material: 'daisy_y19', name_str: 'daisy_y19', image: '', hex: '#F1DD3A', status: 'active', availableUntil: '', partId: '' },
        60: { material: 'chirp_y20', name_str: 'chirp_y20', image: '', hex: '#F4E445', status: 'active', availableUntil: '', partId: '' },
        61: { material: 'marigold_y21', name_str: 'marigold_y21', image: '', hex: '#F4EC90', status: 'active', availableUntil: '', partId: '' },
        62: { material: 'springtime_y22', name_str: 'springtime_y22', image: '', hex: '#F6F3B7', status: 'active', availableUntil: '', partId: '' },
        63: { material: 'camel_y23', name_str: 'camel_y23', image: '', hex: '#EBE2A0', status: 'active', availableUntil: '', partId: '' },
        64: { material: 'wafer_y24', name_str: 'wafer_y24', image: '', hex: '#DDCD8C', status: 'active', availableUntil: '', partId: '' },
        65: { material: 'cider_y25', name_str: 'cider_y25', image: '', hex: '#CEBC6F', status: 'active', availableUntil: '', partId: '' },
        66: { material: 'syrup_y26', name_str: 'syrup_y26', image: '', hex: '#907135', status: 'active', availableUntil: '', partId: '' },
        67: { material: 'glazed_g15', name_str: 'glazed_g15', image: '', hex: '#EBEAD4', status: 'active', availableUntil: '', partId: '' },
        68: { material: 'pickle_g16', name_str: 'pickle_g16', image: '', hex: '#EBE9C8', status: 'active', availableUntil: '', partId: '' },
        69: { material: 'lark_g17', name_str: 'lark_g17', image: '', hex: '#E2E1C5', status: 'active', availableUntil: '', partId: '' },
        70: { material: 'pear_g18', name_str: 'pear_g18', image: '', hex: '#E6E8D3', status: 'active', availableUntil: '', partId: '' },
        71: { material: 'cucumber_g19', name_str: 'cucumber_g19', image: '', hex: '#E4E7CC', status: 'active', availableUntil: '', partId: '' },
        72: { material: 'nomad_g20', name_str: 'nomad_g20', image: '', hex: '#CECDB6', status: 'active', availableUntil: '', partId: '' },
        73: { material: 'chai_g21', name_str: 'chai_g21', image: '', hex: '#736633', status: 'active', availableUntil: '', partId: '' },
        74: { material: 'terrace_g22', name_str: 'terrace_g22', image: '', hex: '#A99B5C', status: 'active', availableUntil: '', partId: '' },
        75: { material: 'swamp_g23', name_str: 'swamp_g23', image: '', hex: '#BFB98A', status: 'active', availableUntil: '', partId: '' },
        76: { material: 'hickory_g24', name_str: 'hickory_g24', image: '', hex: '#C4B944', status: 'active', availableUntil: '', partId: '' },
        77: { material: 'vegan_g25', name_str: 'vegan_g25', image: '', hex: '#C9C641', status: 'active', availableUntil: '', partId: '' },
        78: { material: 'citron_g26', name_str: 'citron_g26', image: '', hex: '#DFDB54', status: 'active', availableUntil: '', partId: '' },
        79: { material: 'acre_g27', name_str: 'acre_g27', image: '', hex: '#C2CC54', status: 'active', availableUntil: '', partId: '' },
        80: { material: 'turtle_g28', name_str: 'turtle_g28', image: '', hex: '#BACE4D', status: 'active', availableUntil: '', partId: '' },
        81: { material: 'guacamole_g29', name_str: 'guacamole_g29', image: '', hex: '#DDE187', status: 'active', availableUntil: '', partId: '' },
        82: { material: 'minnow_g30', name_str: 'minnow_g30', image: '', hex: '#D9E3C3', status: 'active', availableUntil: '', partId: '' },
        83: { material: 'garden_g31', name_str: 'garden_g31', image: '', hex: '#E8EAA1', status: 'active', availableUntil: '', partId: '' },
        84: { material: 'sweet_pea_g32', name_str: 'sweet_pea_g32', image: '', hex: '#E6E99D', status: 'active', availableUntil: '', partId: '' },
        85: { material: 'moss_g33', name_str: 'moss_g33', image: '', hex: '#CBD58A', status: 'active', availableUntil: '', partId: '' },
        86: { material: 'marsh_g34', name_str: 'marsh_g34', image: '', hex: '#B9C583', status: 'active', availableUntil: '', partId: '' },
        87: { material: 'rainforest_g35', name_str: 'rainforest_g35', image: '', hex: '#9AA26A', status: 'active', availableUntil: '', partId: '' },
        88: { material: 'basil_g36', name_str: 'basil_g36', image: '', hex: '#94A551', status: 'active', availableUntil: '', partId: '' },
        89: { material: 'apple_g37', name_str: 'apple_g37', image: '', hex: '#B3CA86', status: 'active', availableUntil: '', partId: '' },
        90: { material: 'rosemary_g38', name_str: 'rosemary_g38', image: '', hex: '#CDD498', status: 'active', availableUntil: '', partId: '' },
        91: { material: 'laurel_g39', name_str: 'laurel_g39', image: '', hex: '#89AE6F', status: 'active', availableUntil: '', partId: '' },
        92: { material: 'cilantro_g40', name_str: 'cilantro_g40', image: '', hex: '#63924A', status: 'active', availableUntil: '', partId: '' },
        93: { material: 'tropical_g41', name_str: 'tropical_g41', image: '', hex: '#6FAE45', status: 'active', availableUntil: '', partId: '' },
        94: { material: 'lawn_g42', name_str: 'lawn_g42', image: '', hex: '#AECB76', status: 'active', availableUntil: '', partId: '' },
        95: { material: 'thyme_g43', name_str: 'thyme_g43', image: '', hex: '#C8DA90', status: 'active', availableUntil: '', partId: '' },
        96: { material: 'zucchini_g44', name_str: 'zucchini_g44', image: '', hex: '#CBDCA5', status: 'active', availableUntil: '', partId: '' },
        97: { material: 'rivulet_g45', name_str: 'rivulet_g45', image: '', hex: '#9BB89E', status: 'active', availableUntil: '', partId: '' },
        98: { material: 'oregano_g46', name_str: 'oregano_g46', image: '', hex: '#89B18C', status: 'active', availableUntil: '', partId: '' },
        99: { material: 'shamrock_g47', name_str: 'shamrock_g47', image: '', hex: '#65AF81', status: 'active', availableUntil: '', partId: '' },
        100: { material: 'lucky_g48', name_str: 'lucky_g48', image: '', hex: '#5B957D', status: 'active', availableUntil: '', partId: '' },
        101: { material: 'isle_g49', name_str: 'isle_g49', image: '', hex: '#6B887A', status: 'active', availableUntil: '', partId: '' },
        102: { material: 'seine_g50', name_str: 'seine_g50', image: '', hex: '#98C8BC', status: 'active', availableUntil: '', partId: '' },
        103: { material: 'awash_g51', name_str: 'awash_g51', image: '', hex: '#CDE0CE', status: 'active', availableUntil: '', partId: '' },
        104: { material: 'pixie_g52', name_str: 'pixie_g52', image: '', hex: '#9AC9C1', status: 'active', availableUntil: '', partId: '' },
        105: { material: 'capri_g53', name_str: 'capri_g53', image: '', hex: '#67B3AB', status: 'active', availableUntil: '', partId: '' },
        106: { material: 'persian_g54', name_str: 'persian_g54', image: '', hex: '#53AB9C', status: 'active', availableUntil: '', partId: '' },
        107: { material: 'kilt_g55', name_str: 'kilt_g55', image: '', hex: '#30A08D', status: 'active', availableUntil: '', partId: '' },
        108: { material: 'emperor_g56', name_str: 'emperor_g56', image: '', hex: '#51927D', status: 'active', availableUntil: '', partId: '' },
        109: { material: 'julep_g57', name_str: 'julep_g57', image: '', hex: '#72B594', status: 'active', availableUntil: '', partId: '' },
        110: { material: 'eden_g58', name_str: 'eden_g58', image: '', hex: '#CADEB4', status: 'active', availableUntil: '', partId: '' },
        111: { material: 'jardin_g59', name_str: 'jardin_g59', image: '', hex: '#DBE9DE', status: 'active', availableUntil: '', partId: '' },
        112: { material: 'aloe_g60', name_str: 'aloe_g60', image: '', hex: '#E9ECDD', status: 'active', availableUntil: '', partId: '' },
        113: { material: 'sapling_g61', name_str: 'sapling_g61', image: '', hex: '#DAE1C6', status: 'active', availableUntil: '', partId: '' },
        114: {
          material: 'wintergreen_g62',
          name_str: 'wintergreen_g62',
          image: '',
          hex: '#DCE4C6',
          status: 'active',
          availableUntil: '',
          partId: ''
        },
        115: { material: 'copen_g63', name_str: 'copen_g63', image: '', hex: '#E5EACA', status: 'active', availableUntil: '', partId: '' },
        116: { material: 'jewel_b11', name_str: 'jewel_b11', image: '', hex: '#3D6F6C', status: 'active', availableUntil: '', partId: '' },
        117: { material: 'saltwater_b12', name_str: 'saltwater_b12', image: '', hex: '#35747F', status: 'active', availableUntil: '', partId: '' },
        118: { material: 'venice_b13', name_str: 'venice_b13', image: '', hex: '#4DABB2', status: 'active', availableUntil: '', partId: '' },
        119: { material: 'sea_b14', name_str: 'sea_b14', image: '', hex: '#9AC9C1', status: 'active', availableUntil: '', partId: '' },
        120: { material: 'cayman_b15', name_str: 'cayman_b15', image: '', hex: '#B0D5D5', status: 'active', availableUntil: '', partId: '' },
        121: { material: 'swan_dive_b16', name_str: 'swan_dive_b16', image: '', hex: '#BCDAD6', status: 'active', availableUntil: '', partId: '' },
        122: { material: 'heron_b17', name_str: 'heron_b17', image: '', hex: '#D2E5E6', status: 'active', availableUntil: '', partId: '' },
        123: { material: 'reef_b18', name_str: 'reef_b18', image: '', hex: '#DDE9E6', status: 'active', availableUntil: '', partId: '' },
        124: { material: 'seahorse_b19', name_str: 'seahorse_b19', image: '', hex: '#E9F2EC', status: 'active', availableUntil: '', partId: '' },
        125: { material: 'buoyant_b20', name_str: 'buoyant_b20', image: '', hex: '#DBEAE0', status: 'active', availableUntil: '', partId: '' },
        126: { material: 'cruise_b21', name_str: 'cruise_b21', image: '', hex: '#94C9DA', status: 'active', availableUntil: '', partId: '' },
        127: { material: 'poseidon_b22', name_str: 'poseidon_b22', image: '', hex: '#5EABC2', status: 'active', availableUntil: '', partId: '' },
        128: { material: 'calypso_b23', name_str: 'calypso_b23', image: '', hex: '#2288B1', status: 'active', availableUntil: '', partId: '' },
        129: { material: 'matisse_b24', name_str: 'matisse_b24', image: '', hex: '#469ACF', status: 'active', availableUntil: '', partId: '' },
        130: { material: 'cobalt_b25', name_str: 'cobalt_b25', image: '', hex: '#4C8FCC', status: 'active', availableUntil: '', partId: '' },
        131: { material: 'cassidy_b26', name_str: 'cassidy_b26', image: '', hex: '#396BAF', status: 'active', availableUntil: '', partId: '' },
        132: { material: 'catalina_b27', name_str: 'catalina_b27', image: '', hex: '#2C5BA2', status: 'active', availableUntil: '', partId: '' },
        133: { material: 'dory_b28', name_str: 'dory_b28', image: '', hex: '#1C6EAE', status: 'active', availableUntil: '', partId: '' },
        134: { material: 'lapis_b29', name_str: 'lapis_b29', image: '', hex: '#1D5B99', status: 'active', availableUntil: '', partId: '' },
        135: { material: 'wizard_b30', name_str: 'wizard_b30', image: '', hex: '#2F4A70', status: 'active', availableUntil: '', partId: '' },
        136: { material: 'denim_b31', name_str: 'denim_b31', image: '', hex: '#628CAF', status: 'active', availableUntil: '', partId: '' },
        137: { material: 'harbor_b32', name_str: 'harbor_b32', image: '', hex: '#5A94AF', status: 'active', availableUntil: '', partId: '' },
        138: { material: 'mariner_b33', name_str: 'mariner_b33', image: '', hex: '#7C9FA6', status: 'active', availableUntil: '', partId: '' },
        139: { material: 'loch_b34', name_str: 'loch_b34', image: '', hex: '#8DA6AA', status: 'active', availableUntil: '', partId: '' },
        140: { material: 'atlantic_b35', name_str: 'atlantic_b35', image: '', hex: '#89AAB9', status: 'active', availableUntil: '', partId: '' },
        141: { material: 'raindrop_b36', name_str: 'raindrop_b36', image: '', hex: '#97C3DB', status: 'active', availableUntil: '', partId: '' },
        142: { material: 'shoreline_b37', name_str: 'shoreline_b37', image: '', hex: '#7EC0DC', status: 'active', availableUntil: '', partId: '' },
        143: { material: 'surf_b38', name_str: 'surf_b38', image: '', hex: '#BBDCE9', status: 'active', availableUntil: '', partId: '' },
        144: { material: 'robin_b39', name_str: 'robin_b39', image: '', hex: '#D3E7EF', status: 'active', availableUntil: '', partId: '' },
        145: { material: 'tide_b40', name_str: 'tide_b40', image: '', hex: '#E3EDF3', status: 'active', availableUntil: '', partId: '' },
        146: { material: 'aviator_b41', name_str: 'aviator_b41', image: '', hex: '#DAE3E7', status: 'active', availableUntil: '', partId: '' },
        147: { material: 'cloudless_b42', name_str: 'cloudless_b42', image: '', hex: '#DEEAF4', status: 'active', availableUntil: '', partId: '' },
        148: { material: 'fountain_b43', name_str: 'fountain_b43', image: '', hex: '#B3D6ED', status: 'active', availableUntil: '', partId: '' },
        149: { material: 'flood_b44', name_str: 'flood_b44', image: '', hex: '#A1CDEA', status: 'active', availableUntil: '', partId: '' },
        150: { material: 'pier_b45', name_str: 'pier_b45', image: '', hex: '#77B0E1', status: 'active', availableUntil: '', partId: '' },
        151: { material: 'cornflower_b46', name_str: 'cornflower_b46', image: '', hex: '#92C4ED', status: 'active', availableUntil: '', partId: '' },
        152: { material: 'lago_b47', name_str: 'lago_b47', image: '', hex: '#ACCFEE', status: 'active', availableUntil: '', partId: '' },
        153: { material: 'skydive_b48', name_str: 'skydive_b48', image: '', hex: '#C0DBF2', status: 'active', availableUntil: '', partId: '' },
        154: { material: 'bliss_b49', name_str: 'bliss_b49', image: '', hex: '#C0D6EF', status: 'active', availableUntil: '', partId: '' },
        155: { material: 'daydream_b50', name_str: 'daydream_b50', image: '', hex: '#B0C6DF', status: 'active', availableUntil: '', partId: '' },
        156: { material: 'bay_b51', name_str: 'bay_b51', image: '', hex: '#87A3C4', status: 'active', availableUntil: '', partId: '' },
        157: { material: 'midnight_b52', name_str: 'midnight_b52', image: '', hex: '#80A4D6', status: 'active', availableUntil: '', partId: '' },
        158: { material: 'tahoe_b53', name_str: 'tahoe_b53', image: '', hex: '#436FB2', status: 'active', availableUntil: '', partId: '' },
        159: { material: 'nautical_b54', name_str: 'nautical_b54', image: '', hex: '#4D73A5', status: 'active', availableUntil: '', partId: '' },
        160: { material: 'cadet_b55', name_str: 'cadet_b55', image: '', hex: '#627EA4', status: 'active', availableUntil: '', partId: '' },
        161: { material: 'moonstone_b56', name_str: 'moonstone_b56', image: '', hex: '#738FB7', status: 'active', availableUntil: '', partId: '' },
        162: { material: 'sparta_b57', name_str: 'sparta_b57', image: '', hex: '#849ACD', status: 'active', availableUntil: '', partId: '' },
        163: { material: 'atlas_b58', name_str: 'atlas_b58', image: '', hex: '#5D78B7', status: 'active', availableUntil: '', partId: '' },
        164: { material: 'hyacinth_b59', name_str: 'hyacinth_b59', image: '', hex: '#5B72B2', status: 'active', availableUntil: '', partId: '' },
        165: { material: 'mythical_b60', name_str: 'mythical_b60', image: '', hex: '#2B3C78', status: 'active', availableUntil: '', partId: '' },
        166: { material: 'bluejay_b61', name_str: 'bluejay_b61', image: '', hex: '#57678A', status: 'active', availableUntil: '', partId: '' },
        167: { material: 'monsoon_b62', name_str: 'monsoon_b62', image: '', hex: '#5B6E80', status: 'active', availableUntil: '', partId: '' },
        168: { material: 'overcast_b63', name_str: 'overcast_b63', image: '', hex: '#425559', status: 'active', availableUntil: '', partId: '' },
        169: { material: 'majesty_v03', name_str: 'majesty_v03', image: '', hex: '#383048', status: 'active', availableUntil: '', partId: '' },
        170: { material: 'amethyst_v04', name_str: 'amethyst_v04', image: '', hex: '#5C599D', status: 'active', availableUntil: '', partId: '' },
        171: { material: 'dahlia_v05', name_str: 'dahlia_v05', image: '', hex: '#8289BF', status: 'active', availableUntil: '', partId: '' },
        172: { material: 'lavender_v06', name_str: 'lavender_v06', image: '', hex: '#8B8EAB', status: 'active', availableUntil: '', partId: '' },
        173: { material: 'violet_v07', name_str: 'violet_v07', image: '', hex: '#B2B8DA', status: 'active', availableUntil: '', partId: '' },
        174: { material: 'dawn_v08', name_str: 'dawn_v08', image: '', hex: '#BDBFDF', status: 'active', availableUntil: '', partId: '' },
        175: { material: 'lilac_v09', name_str: 'lilac_v09', image: '', hex: '#B9B1C8', status: 'active', availableUntil: '', partId: '' },
        176: { material: 'boulevard_v10', name_str: 'boulevard_v10', image: '', hex: '#AF9BBA', status: 'active', availableUntil: '', partId: '' },
        177: { material: 'iris_v11', name_str: 'iris_v11', image: '', hex: '#775B88', status: 'active', availableUntil: '', partId: '' },
        178: { material: 'prince_v12', name_str: 'prince_v12', image: '', hex: '#732674', status: 'active', availableUntil: '', partId: '' },
        179: { material: 'bewitched_v13', name_str: 'bewitched_v13', image: '', hex: '#A57D99', status: 'active', availableUntil: '', partId: '' },
        180: { material: 'aphrodite_v14', name_str: 'aphrodite_v14', image: '', hex: '#B57AA9', status: 'active', availableUntil: '', partId: '' },
        181: { material: 'lollipop_v15', name_str: 'lollipop_v15', image: '', hex: '#D9B3D1', status: 'active', availableUntil: '', partId: '' },
        182: { material: 'lily_v16', name_str: 'lily_v16', image: '', hex: '#E9D9E3', status: 'active', availableUntil: '', partId: '' },
        183: { material: 'cosmo_v17', name_str: 'cosmo_v17', image: '', hex: '#F0DAE8', status: 'active', availableUntil: '', partId: '' },
        184: { material: 'cupid_v18', name_str: 'cupid_v18', image: '', hex: '#E8BCD4', status: 'active', availableUntil: '', partId: '' },
        185: { material: 'flamingo_v19', name_str: 'flamingo_v19', image: '', hex: '#DC90B7', status: 'active', availableUntil: '', partId: '' },
        186: { material: 'sassy_v20', name_str: 'sassy_v20', image: '', hex: '#DA85A3', status: 'active', availableUntil: '', partId: '' },
        187: { material: 'dollhouse_v21', name_str: 'dollhouse_v21', image: '', hex: '#D36D94', status: 'active', availableUntil: '', partId: '' },
        188: { material: 'tamale_v22', name_str: 'tamale_v22', image: '', hex: '#C63139', status: 'active', availableUntil: '', partId: '' },
        189: { material: 'jam_v23', name_str: 'jam_v23', image: '', hex: '#C12C42', status: 'active', availableUntil: '', partId: '' },
        190: { material: 'hibiscus_v24', name_str: 'hibiscus_v24', image: '', hex: '#B73248', status: 'active', availableUntil: '', partId: '' },
        191: { material: 'taffy_v25', name_str: 'taffy_v25', image: '', hex: '#9D3151', status: 'active', availableUntil: '', partId: '' },
        192: { material: 'fig_v26', name_str: 'fig_v26', image: '', hex: '#4C1C3C', status: 'active', availableUntil: '', partId: '' },
        193: { material: 'bohemian_v27', name_str: 'bohemian_v27', image: '', hex: '#7A5A62', status: 'active', availableUntil: '', partId: '' },
        194: { material: 'gypsum_n06', name_str: 'gypsum_n06', image: '', hex: '#E9E5CF', status: 'active', availableUntil: '', partId: '' },
        195: { material: 'biscotti_n07', name_str: 'biscotti_n07', image: '', hex: '#EBE4D6', status: 'active', availableUntil: '', partId: '' },
        196: { material: 'sable_n08', name_str: 'sable_n08', image: '', hex: '#E0D4C5', status: 'active', availableUntil: '', partId: '' },
        197: { material: 'toasted_n09', name_str: 'toasted_n09', image: '', hex: '#EBE0C1', status: 'active', availableUntil: '', partId: '' },
        198: { material: 'melon_n10', name_str: 'melon_n10', image: '', hex: '#F0E0BB', status: 'active', availableUntil: '', partId: '' },
        199: { material: 'allyssa_n11', name_str: 'allyssa_n11', image: '', hex: '#ECDBBD', status: 'active', availableUntil: '', partId: '' },
        200: { material: 'nectar_n12', name_str: 'nectar_n12', image: '', hex: '#EFE5CF', status: 'active', availableUntil: '', partId: '' },
        201: { material: 'glow_n13', name_str: 'glow_n13', image: '', hex: '#F9F4D8', status: 'active', availableUntil: '', partId: '' },
        202: { material: 'lemon_n14', name_str: 'lemon_n14', image: '', hex: '#F7F1C8', status: 'active', availableUntil: '', partId: '' },
        203: { material: 'sunrise_n15', name_str: 'sunrise_n15', image: '', hex: '#F3E7C6', status: 'active', availableUntil: '', partId: '' },
        204: { material: 'mellow_n16', name_str: 'mellow_n16', image: '', hex: '#F4E7B5', status: 'active', availableUntil: '', partId: '' },
        205: { material: 'lioness_n17', name_str: 'lioness_n17', image: '', hex: '#EFE3BF', status: 'active', availableUntil: '', partId: '' },
        206: { material: 'fawn_n18', name_str: 'fawn_n18', image: '', hex: '#DFD0AD', status: 'active', availableUntil: '', partId: '' },
        207: { material: 'jicama_n19', name_str: 'jicama_n19', image: '', hex: '#BEAA78', status: 'active', availableUntil: '', partId: '' },
        208: { material: 'almond_n20', name_str: 'almond_n20', image: '', hex: '#9A8A64', status: 'active', availableUntil: '', partId: '' },
        209: { material: 'saddle_n21', name_str: 'saddle_n21', image: '', hex: '#9D7B55', status: 'active', availableUntil: '', partId: '' },
        210: { material: 'khaki_n22', name_str: 'khaki_n22', image: '', hex: '#D3CAAB', status: 'active', availableUntil: '', partId: '' },
        211: { material: 'oat_n23', name_str: 'oat_n23', image: '', hex: '#F0EEE4', status: 'active', availableUntil: '', partId: '' },
        212: { material: 'dew_n24', name_str: 'dew_n24', image: '', hex: '#E5E4D1', status: 'active', availableUntil: '', partId: '' },
        213: { material: 'farmer_n25', name_str: 'farmer_n25', image: '', hex: '#B5AA8C', status: 'active', availableUntil: '', partId: '' },
        214: {
          material: 'bittersweet_n26',
          name_str: 'bittersweet_n26',
          image: '',
          hex: '#382B1E',
          status: 'active',
          availableUntil: '',
          partId: ''
        },
        215: { material: 'sepia_n27', name_str: 'sepia_n27', image: '', hex: '#A4937A', status: 'active', availableUntil: '', partId: '' },
        216: { material: 'bark_n28', name_str: 'bark_n28', image: '', hex: '#8F6D4B', status: 'active', availableUntil: '', partId: '' },
        217: { material: 'whiskey_n29', name_str: 'whiskey_n29', image: '', hex: '#985A28', status: 'active', availableUntil: '', partId: '' },
        218: { material: 'leather_n30', name_str: 'leather_n30', image: '', hex: '#532D1D', status: 'active', availableUntil: '', partId: '' },
        219: { material: 'redwood_n31', name_str: 'redwood_n31', image: '', hex: '#AE7757', status: 'active', availableUntil: '', partId: '' },
        220: { material: 'blush_n32', name_str: 'blush_n32', image: '', hex: '#CAAA93', status: 'active', availableUntil: '', partId: '' },
        221: { material: 'eggplant_n33', name_str: 'eggplant_n33', image: '', hex: '#A77F6E', status: 'active', availableUntil: '', partId: '' },
        222: { material: 'teaberry_n34', name_str: 'teaberry_n34', image: '', hex: '#E9DEDB', status: 'active', availableUntil: '', partId: '' },
        223: { material: 'concord_n35', name_str: 'concord_n35', image: '', hex: '#AD9C9D', status: 'active', availableUntil: '', partId: '' },
        224: { material: 'compass_n36', name_str: 'compass_n36', image: '', hex: '#ABA7A5', status: 'active', availableUntil: '', partId: '' },
        225: { material: 'smudge_n37', name_str: 'smudge_n37', image: '', hex: '#C2C3C0', status: 'active', availableUntil: '', partId: '' },
        226: { material: 'zeppelin_n38', name_str: 'zeppelin_n38', image: '', hex: '#8D8F91', status: 'active', availableUntil: '', partId: '' },
        227: { material: 'alley_n39', name_str: 'alley_n39', image: '', hex: '#4C4C53', status: 'active', availableUntil: '', partId: '' },
        228: { material: 'gotham_n40', name_str: 'gotham_n40', image: '', hex: '#282C2E', status: 'active', availableUntil: '', partId: '' },
        229: { material: 'cauldron_n41', name_str: 'cauldron_n41', image: '', hex: '#485051', status: 'active', availableUntil: '', partId: '' },
        230: { material: 'drizzle_n42', name_str: 'drizzle_n42', image: '', hex: '#B4BDBA', status: 'active', availableUntil: '', partId: '' },
        231: { material: 'porpoise_n43', name_str: 'porpoise_n43', image: '', hex: '#C7C9C8', status: 'active', availableUntil: '', partId: '' },
        232: { material: 'wolf_n44', name_str: 'wolf_n44', image: '', hex: '#BDC1C3', status: 'active', availableUntil: '', partId: '' },
        233: { material: 'cityscape_n45', name_str: 'cityscape_n45', image: '', hex: '#E3E6EA', status: 'active', availableUntil: '', partId: '' },
        234: { material: 'pond_n46', name_str: 'pond_n46', image: '', hex: '#EFF5F9', status: 'active', availableUntil: '', partId: '' },
        235: { material: 'nebulous_n47', name_str: 'nebulous_n47', image: '', hex: '#F7F8F8', status: 'active', availableUntil: '', partId: '' },
        236: { material: 'helium_n48', name_str: 'helium_n48', image: '', hex: '#F3F4F3', status: 'active', availableUntil: '', partId: '' },
        237: { material: 'ash_n49', name_str: 'ash_n49', image: '', hex: '#E6E7E7', status: 'active', availableUntil: '', partId: '' },
        238: { material: 'elephant_n50', name_str: 'elephant_n50', image: '', hex: '#D9DADB', status: 'active', availableUntil: '', partId: '' },
        239: { material: 'thunder_n51', name_str: 'thunder_n51', image: '', hex: '#D4D4D4', status: 'active', availableUntil: '', partId: '' },
        240: { material: 'pewter_n52', name_str: 'pewter_n52', image: '', hex: '#D7D6CF', status: 'active', availableUntil: '', partId: '' },
        241: { material: 'rockport_n53', name_str: 'rockport_n53', image: '', hex: '#E7E5DE', status: 'active', availableUntil: '', partId: '' },
        242: { material: 'roadside_n54', name_str: 'roadside_n54', image: '', hex: '#D0CABB', status: 'active', availableUntil: '', partId: '' },
        243: { material: 'wren_n55', name_str: 'wren_n55', image: '', hex: '#CEC7B6', status: 'active', availableUntil: '', partId: '' },
        244: { material: 'warmstone_n56', name_str: 'warmstone_n56', image: '', hex: '#B6B0A3', status: 'active', availableUntil: '', partId: '' },
        245: { material: 'galvanize_n57', name_str: 'galvanize_n57', image: '', hex: '#988F89', status: 'active', availableUntil: '', partId: '' },
        246: { material: 'noir_n58', name_str: 'noir_n58', image: '', hex: '#6A675E', status: 'active', availableUntil: '', partId: '' },
        247: { material: 'meteorite_n59', name_str: 'meteorite_n59', image: '', hex: '#4C4841', status: 'active', availableUntil: '', partId: '' },
        248: { material: 'nightshade_n60', name_str: 'nightshade_n60', image: '', hex: '#423A32', status: 'active', availableUntil: '', partId: '' },
        249: { material: 'dust_n61', name_str: 'dust_n61', image: '', hex: '#EBE8E4', status: 'active', availableUntil: '', partId: '' },
        250: { material: 'clear', hex: '#ffffff', status: 'active', availableUntil: '', partId: 1 }
      }
    },
    finishes: {
      standard: {
        0: {
          db_id: '1769',
          image: '/assets/images/profile/finishes/crystal_white.jpg',
          name_str: 'crystal_white',
          material: 'Crystal White',
          status: 'active',
          available_until: ''
        },
        1: {
          db_id: '1770',
          image: '/assets/images/profile/finishes/white_chocolate.jpg',
          name_str: 'white_chocolate',
          material: 'White Chocolate',
          status: 'active',
          available_until: ''
        },
        2: {
          db_id: '1771',
          image: '/assets/images/profile/finishes/milk_chocolate.jpg',
          name_str: 'milk_chocolate',
          material: 'Milk Chocolate',
          status: 'active',
          available_until: ''
        },
        3: {
          db_id: '1772',
          image: '/assets/images/profile/finishes/dark_chocolate.jpg',
          name_str: 'dark_chocolate',
          material: 'Dark Chocolate',
          status: 'active',
          available_until: ''
        },
        4: {
          db_id: '1773',
          image: '/assets/images/profile/finishes/milltown_oak.jpg',
          name_str: 'milltown_oak',
          material: 'Milltown Oak',
          status: 'active',
          available_until: ''
        },
        5: {
          db_id: '1774',
          image: '/assets/images/profile/finishes/queenston_oak.jpg',
          name_str: 'queenston_oak',
          material: 'Queenston Oak',
          status: 'active',
          available_until: ''
        },
        6: {
          db_id: '1776',
          image: '/assets/images/profile/finishes/majestic_walnut.jpg',
          name_str: 'majestic_walnut',
          material: 'Majestic Walnut',
          status: 'active',
          available_until: ''
        },
        7: {
          db_id: '1777',
          image: '/assets/images/profile/finishes/milk_wash.jpg',
          name_str: 'milk_wash',
          material: 'Milk Wash',
          status: 'active',
          available_until: ''
        },
        8: {
          db_id: '1778',
          image: '/assets/images/profile/finishes/aluminum.jpg',
          name_str: 'aluminum',
          material: 'Aluminum',
          status: 'active',
          available_until: ''
        },
        9: {
          db_id: '1779',
          image: '/assets/images/profile/finishes/rift_oak.jpg',
          name_str: 'rift_oak',
          material: 'Rift Oak',
          status: 'active',
          available_until: ''
        },
        10: {
          db_id: '1780',
          image: '/assets/images/profile/finishes/honey_maple.jpg',
          name_str: 'honey_maple',
          material: 'Honey Maple',
          status: 'active',
          available_until: ''
        },
        11: {
          db_id: '9141',
          image: '/assets/images/profile/finishes/enamel_white.jpg',
          name_str: 'enamel_white',
          material: 'Enamel White',
          status: 'active',
          available_until: ''
        },
        12: {
          db_id: '9142',
          image: '/assets/images/profile/finishes/sculpted_wenge.jpg',
          name_str: 'sculpted_wenge',
          material: 'Sculpted Wenge',
          status: 'active',
          available_until: ''
        },
        13: {
          db_id: '9143',
          image: '/assets/images/profile/finishes/rift_ebony.jpg',
          name_str: 'rift_ebony',
          material: 'Rift Ebony',
          status: 'active',
          available_until: ''
        },
        14: {
          db_id: '9144',
          image: '/assets/images/profile/finishes/toasted_walnut.jpg',
          name_str: 'toasted_walnut',
          material: 'Toasted Walnut',
          status: 'active',
          available_until: ''
        },
        15: {
          db_id: '9145',
          image: '/assets/images/profile/finishes/ash_white.jpg',
          name_str: 'ash_white',
          material: 'Ash White',
          status: 'active',
          available_until: ''
        },
        16: {
          db_id: '9146',
          image: '/assets/images/profile/finishes/enamel_red.jpg',
          name_str: 'enamel_red',
          material: 'Enamel Red',
          status: 'active',
          available_until: ''
        },
        17: {
          db_id: '9148',
          image: '/assets/images/profile/finishes/creme.jpg',
          name_str: 'creme',
          material: 'Creme',
          status: 'active',
          available_until: ''
        },
        18: {
          db_id: '9149',
          image: '/assets/images/profile/finishes/beachwood.jpg',
          name_str: 'beachwood',
          material: 'Beachwood',
          status: 'active',
          available_until: ''
        },
        19: {
          db_id: '9150',
          image: '/assets/images/profile/finishes/paint_ready_laminate.jpg',
          name_str: 'paint_ready_laminate',
          material: 'Paint Ready Laminate',
          status: 'active',
          available_until: ''
        },
        20: {
          db_id: '9669',
          image: '/assets/images/profile/finishes/brushed_bronze.jpg',
          name_str: 'brushed_bronze',
          material: 'Brushed Bronze',
          status: 'active',
          available_until: ''
        },
        21: {
          db_id: '9671',
          image: '/assets/images/profile/finishes/brushed_copper.jpg',
          name_str: 'brushed_copper',
          material: 'Brushed Copper',
          status: 'active',
          available_until: ''
        },
        22: {
          db_id: '9672',
          image: '/assets/images/profile/finishes/brushed_gunmetal.jpg',
          name_str: 'brushed_gunmetal',
          material: 'Brushed Gunmetal',
          status: 'active',
          available_until: ''
        },
        23: {
          db_id: '9673',
          image: '/assets/images/profile/finishes/brushed_iron.jpg',
          name_str: 'brushed_iron',
          material: 'Brushed Iron',
          status: 'active',
          available_until: ''
        },
        24: {
          db_id: '9674',
          image: '/assets/images/profile/finishes/silver_grain.jpg',
          name_str: 'silver_grain',
          material: 'Silver Grain',
          status: 'active',
          available_until: ''
        },
        25: {
          db_id: '11484',
          image: '/assets/images/profile/finishes/baltic_birch.jpg',
          name_str: 'baltic_birch',
          material: 'Baltic Birch',
          status: 'active',
          available_until: ''
        },
        26: {
          db_id: '11485',
          image: '/assets/images/profile/finishes/poplar.jpg',
          name_str: 'poplar',
          material: 'Poplar',
          status: 'active',
          available_until: ''
        }
      }
    }
  };
  constructor() {}
}

export interface PartsSubs {
  partId: string;
  replacementPartId: string;
  effectiveDate: string;
}
