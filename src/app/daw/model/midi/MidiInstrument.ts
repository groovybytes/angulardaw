export class MidiInstrument{
  id:string;
  hexId:string;
  name:string;
  name_german:string;

  public static specs:Array<MidiInstrument>=
    [{
      "id": "1",
      "hexId": "00",
      "name": "Acoustic Piano",
      "name_german": "Konzertflügel"
    },
      {
        "id": "2",
        "hexId": "01",
        "name": "Bright Piano",
        "name_german": "Heller Flügel"
      },
      {
        "id": "3",
        "hexId": "02",
        "name": "Electric Grand Piano",
        "name_german": "Elektrischer Flügel"
      },
      {
        "id": "4",
        "hexId": "03",
        "name": "Honky-tonk Piano",
        "name_german": "Honky-Tonk-Klavier"
      },
      {
        "id": "5",
        "hexId": "04",
        "name": "Electric Piano 1",
        "name_german": "Elektronisches Piano 1"
      },
      {
        "id": "6",
        "hexId": "05",
        "name": "Electric Piano 2",
        "name_german": "Elektronisches Piano 2"
      },
      {
        "id": "7",
        "hexId": "06",
        "name": "Harpsichord",
        "name_german": "Cembalo"
      },
      {
        "id": "8",
        "hexId": "07",
        "name": "Clavi",
        "name_german": "Clavichord"
      },
      {
        "id": "Chromatic Percussion",
        "hexId": "",
        "name": "",
        "name_german": ""
      },
      {
        "id": "9",
        "hexId": "08",
        "name": "Celesta",
        "name_german": "Celesta"
      },
      {
        "id": "10",
        "hexId": "09",
        "name": "Glockenspiel",
        "name_german": "Glockenspiel"
      },
      {
        "id": "11",
        "hexId": "0A",
        "name": "Musical box",
        "name_german": "Spieldose"
      },
      {
        "id": "12",
        "hexId": "0B",
        "name": "Vibraphone",
        "name_german": "Vibraphon"
      },
      {
        "id": "13",
        "hexId": "0C",
        "name": "Marimba",
        "name_german": "Marimba"
      },
      {
        "id": "14",
        "hexId": "0D",
        "name": "Xylophone",
        "name_german": "Xylophon"
      },
      {
        "id": "15",
        "hexId": "0E",
        "name": "Tubular Bell",
        "name_german": "Röhrenglocken"
      },
      {
        "id": "16",
        "hexId": "0F",
        "name": "Dulcimer",
        "name_german": "Hackbrett"
      },
      {
        "id": "Organ",
        "hexId": "",
        "name": "",
        "name_german": ""
      },
      {
        "id": "17",
        "hexId": "10",
        "name": "Drawbar Organ",
        "name_german": "Zugorgel"
      },
      {
        "id": "18",
        "hexId": "11",
        "name": "Percussive Organ",
        "name_german": ""
      },
      {
        "id": "19",
        "hexId": "12",
        "name": "Rock Organ",
        "name_german": "Rockorgel"
      },
      {
        "id": "20",
        "hexId": "13",
        "name": "Church organ",
        "name_german": "Kirchenorgel"
      },
      {
        "id": "21",
        "hexId": "14",
        "name": "Reed organ",
        "name_german": "Harmonium"
      },
      {
        "id": "22",
        "hexId": "15",
        "name": "Accordion",
        "name_german": "Akkordeon"
      },
      {
        "id": "23",
        "hexId": "16",
        "name": "Harmonica",
        "name_german": "Mundharmonika"
      },
      {
        "id": "24",
        "hexId": "17",
        "name": "Tango Accordion",
        "name_german": "Bandoneon"
      },
      {
        "id": "Guitar",
        "hexId": "",
        "name": "",
        "name_german": ""
      },
      {
        "id": "25",
        "hexId": "18",
        "name": "Acoustic Guitar (nylon)",
        "name_german": "Akustische Gitarre (Nylon)"
      },
      {
        "id": "26",
        "hexId": "19",
        "name": "Acoustic Guitar (steel)",
        "name_german": "Akustische Gitarre (Stahl)"
      },
      {
        "id": "27",
        "hexId": "1A",
        "name": "Electric Guitar (jazz)",
        "name_german": "E-Gitarre (Jazz)"
      },
      {
        "id": "28",
        "hexId": "1B",
        "name": "Electric Guitar (clean)",
        "name_german": "E-Gitarre (Klar)"
      },
      {
        "id": "29",
        "hexId": "1C",
        "name": "Electric Guitar (muted)",
        "name_german": "E-Gitarre (Gedämpft)"
      },
      {
        "id": "30",
        "hexId": "1D",
        "name": "Overdriven Guitar",
        "name_german": ""
      },
      {
        "id": "31",
        "hexId": "1E",
        "name": "Distortion Guitar",
        "name_german": ""
      },
      {
        "id": "32",
        "hexId": "1F",
        "name": "Guitar harmonics",
        "name_german": ""
      },
      {
        "id": "Bass",
        "hexId": "",
        "name": "",
        "name_german": ""
      },
      {
        "id": "33",
        "hexId": "20",
        "name": "Acoustic Bass",
        "name_german": "Akustischer Bass"
      },
      {
        "id": "34",
        "hexId": "21",
        "name": "Electric Bass (finger)",
        "name_german": "E-Bass (Finger)"
      },
      {
        "id": "35",
        "hexId": "22",
        "name": "Electric Bass (pick)",
        "name_german": "E-Bass (Plektrum)"
      },
      {
        "id": "36",
        "hexId": "23",
        "name": "Fretless Bass",
        "name_german": "Bundlose Gitarre"
      },
      {
        "id": "37",
        "hexId": "24",
        "name": "Slap Bass 1",
        "name_german": ""
      },
      {
        "id": "38",
        "hexId": "25",
        "name": "Slap Bass 2",
        "name_german": ""
      },
      {
        "id": "39",
        "hexId": "26",
        "name": "Synth Bass 1",
        "name_german": ""
      },
      {
        "id": "40",
        "hexId": "27",
        "name": "Synth Bass 2",
        "name_german": ""
      },
      {
        "id": "Strings",
        "hexId": "",
        "name": "",
        "name_german": ""
      },
      {
        "id": "41",
        "hexId": "28",
        "name": "Violin",
        "name_german": "Violine"
      },
      {
        "id": "42",
        "hexId": "29",
        "name": "Viola",
        "name_german": "Bratsche"
      },
      {
        "id": "43",
        "hexId": "2A",
        "name": "Cello",
        "name_german": "Violoncello"
      },
      {
        "id": "44",
        "hexId": "2B",
        "name": "Double bass",
        "name_german": "Kontrabass"
      },
      {
        "id": "45",
        "hexId": "2C",
        "name": "Tremolo Strings",
        "name_german": "Tremolo Streicher"
      },
      {
        "id": "46",
        "hexId": "2D",
        "name": "Pizzicato Strings",
        "name_german": "Pizzicato Streicher"
      },
      {
        "id": "47",
        "hexId": "2E",
        "name": "Orchestral Harp",
        "name_german": "Orchesterharfe"
      },
      {
        "id": "48",
        "hexId": "2F",
        "name": "Timpani",
        "name_german": "Pauke"
      },
      {
        "id": "Ensemble",
        "hexId": "",
        "name": "",
        "name_german": ""
      },
      {
        "id": "49",
        "hexId": "30",
        "name": "String Ensemble 1",
        "name_german": "Streichersemble 1"
      },
      {
        "id": "50",
        "hexId": "31",
        "name": "String Ensemble 2",
        "name_german": "Streichersemble 2"
      },
      {
        "id": "51",
        "hexId": "32",
        "name": "Synth Strings 1",
        "name_german": ""
      },
      {
        "id": "52",
        "hexId": "33",
        "name": "Synth Strings 2",
        "name_german": ""
      },
      {
        "id": "53",
        "hexId": "34",
        "name": "Voice Aahs",
        "name_german": "Stimme \"Aah\""
      },
      {
        "id": "54",
        "hexId": "35",
        "name": "Voice Oohs",
        "name_german": "Stimme \"Ooh\""
      },
      {
        "id": "55",
        "hexId": "36",
        "name": "Synth Voice",
        "name_german": "Synthetische Stimme"
      },
      {
        "id": "56",
        "hexId": "37",
        "name": "Orchestra Hit",
        "name_german": ""
      },
      {
        "id": "Brass",
        "hexId": "",
        "name": "",
        "name_german": ""
      },
      {
        "id": "57",
        "hexId": "38",
        "name": "Trumpet",
        "name_german": "Trompete"
      },
      {
        "id": "58",
        "hexId": "39",
        "name": "Trombone",
        "name_german": "Posaune"
      },
      {
        "id": "59",
        "hexId": "3A",
        "name": "Tuba",
        "name_german": "Tuba"
      },
      {
        "id": "60",
        "hexId": "3B",
        "name": "Muted Trumpet",
        "name_german": "Gedämpfte Trompete"
      },
      {
        "id": "61",
        "hexId": "3C",
        "name": "French horn",
        "name_german": "Horn"
      },
      {
        "id": "62",
        "hexId": "3D",
        "name": "Brass Section",
        "name_german": ""
      },
      {
        "id": "63",
        "hexId": "3E",
        "name": "Synth Brass 1",
        "name_german": ""
      },
      {
        "id": "64",
        "hexId": "3F",
        "name": "Synth Brass 2",
        "name_german": ""
      },
      {
        "id": "Reed",
        "hexId": "",
        "name": "",
        "name_german": ""
      },
      {
        "id": "65",
        "hexId": "40",
        "name": "Soprano Sax",
        "name_german": "Sopransaxophon"
      },
      {
        "id": "66",
        "hexId": "41",
        "name": "Alto Sax",
        "name_german": "Altsaxophon"
      },
      {
        "id": "67",
        "hexId": "42",
        "name": "Tenor Sax",
        "name_german": "Tenorsaxophon"
      },
      {
        "id": "68",
        "hexId": "43",
        "name": "Baritone Sax",
        "name_german": "Baritonsaxophon"
      },
      {
        "id": "69",
        "hexId": "44",
        "name": "Oboe",
        "name_german": "Oboe"
      },
      {
        "id": "70",
        "hexId": "45",
        "name": "English Horn",
        "name_german": "name-Horn"
      },
      {
        "id": "71",
        "hexId": "46",
        "name": "Bassoon",
        "name_german": "Fagott"
      },
      {
        "id": "72",
        "hexId": "47",
        "name": "Clarinet",
        "name_german": "Klarinette"
      },
      {
        "id": "Pipe",
        "hexId": "",
        "name": "",
        "name_german": ""
      },
      {
        "id": "73",
        "hexId": "48",
        "name": "Piccolo",
        "name_german": "Piccoloflöte"
      },
      {
        "id": "74",
        "hexId": "49",
        "name": "Flute",
        "name_german": "Flöte"
      },
      {
        "id": "75",
        "hexId": "4A",
        "name": "Recorder",
        "name_german": "Blockflöte"
      },
      {
        "id": "76",
        "hexId": "4B",
        "name": "Pan Flute",
        "name_german": "Panflöte"
      },
      {
        "id": "77",
        "hexId": "4C",
        "name": "Blown Bottle",
        "name_german": ""
      },
      {
        "id": "78",
        "hexId": "4D",
        "name": "Shakuhachi",
        "name_german": ""
      },
      {
        "id": "79",
        "hexId": "4E",
        "name": "Whistle",
        "name_german": "Pfeife"
      },
      {
        "id": "80",
        "hexId": "4F",
        "name": "Ocarina",
        "name_german": "Okarina"
      },
      {
        "id": "Synth Lead",
        "hexId": "",
        "name": "",
        "name_german": ""
      },
      {
        "id": "81",
        "hexId": "50",
        "name": "Lead 1 (square)",
        "name_german": ""
      },
      {
        "id": "82",
        "hexId": "51",
        "name": "Lead 2 (sawtooth)",
        "name_german": ""
      },
      {
        "id": "83",
        "hexId": "52",
        "name": "Lead 3 (calliope)",
        "name_german": ""
      },
      {
        "id": "84",
        "hexId": "53",
        "name": "Lead 4 (chiff)",
        "name_german": ""
      },
      {
        "id": "85",
        "hexId": "54",
        "name": "Lead 5 (charang)",
        "name_german": ""
      },
      {
        "id": "86",
        "hexId": "55",
        "name": "Lead 6 (voice)",
        "name_german": ""
      },
      {
        "id": "87",
        "hexId": "56",
        "name": "Lead 7 (fifths)",
        "name_german": ""
      },
      {
        "id": "88",
        "hexId": "57",
        "name": "Lead 8 (bass + lead)",
        "name_german": ""
      },
      {
        "id": "Synth Pad",
        "hexId": "",
        "name": "",
        "name_german": ""
      },
      {
        "id": "89",
        "hexId": "58",
        "name": "Pad 1 (Fantasia)",
        "name_german": ""
      },
      {
        "id": "90",
        "hexId": "59",
        "name": "Pad 2 (warm)",
        "name_german": ""
      },
      {
        "id": "91",
        "hexId": "5A",
        "name": "Pad 3 (polysynth)",
        "name_german": ""
      },
      {
        "id": "92",
        "hexId": "5B",
        "name": "Pad 4 (choir)",
        "name_german": ""
      },
      {
        "id": "93",
        "hexId": "5C",
        "name": "Pad 5 (bowed)",
        "name_german": ""
      },
      {
        "id": "94",
        "hexId": "5D",
        "name": "Pad 6 (metallic)",
        "name_german": ""
      },
      {
        "id": "95",
        "hexId": "5E",
        "name": "Pad 7 (halo)",
        "name_german": ""
      },
      {
        "id": "96",
        "hexId": "5F",
        "name": "Pad 8 (sweep)",
        "name_german": ""
      },
      {
        "id": "Synth Effects",
        "hexId": "",
        "name": "",
        "name_german": ""
      },
      {
        "id": "97",
        "hexId": "60",
        "name": "FX 1 (rain)",
        "name_german": "FX 1 (Regen)"
      },
      {
        "id": "98",
        "hexId": "61",
        "name": "FX 2 (soundtrack)",
        "name_german": "FX 2"
      },
      {
        "id": "99",
        "hexId": "62",
        "name": "FX 3 (crystal)",
        "name_german": "FX 3 (Kristall)"
      },
      {
        "id": "100",
        "hexId": "63",
        "name": "FX 4 (atmosphere)",
        "name_german": "FX 4 (Atmosphäre)"
      },
      {
        "id": "101",
        "hexId": "64",
        "name": "FX 5 (brightness)",
        "name_german": "FX 5"
      },
      {
        "id": "102",
        "hexId": "65",
        "name": "FX 6 (goblins)",
        "name_german": "FX 6 (Kobolde)"
      },
      {
        "id": "103",
        "hexId": "66",
        "name": "FX 7 (echoes)",
        "name_german": "FX 7 (Echos)"
      },
      {
        "id": "104",
        "hexId": "67",
        "name": "FX 8 (sci-fi)",
        "name_german": "FX 8 (Science-Fiction)"
      },
      {
        "id": "Ethnic",
        "hexId": "",
        "name": "",
        "name_german": ""
      },
      {
        "id": "105",
        "hexId": "68",
        "name": "Sitar",
        "name_german": "Sitar"
      },
      {
        "id": "106",
        "hexId": "69",
        "name": "Banjo",
        "name_german": "Banjo"
      },
      {
        "id": "107",
        "hexId": "6A",
        "name": "Shamisen",
        "name_german": "Shamisen"
      },
      {
        "id": "108",
        "hexId": "6B",
        "name": "Koto",
        "name_german": "Koto"
      },
      {
        "id": "109",
        "hexId": "6C",
        "name": "Kalimba",
        "name_german": "Lamellophon"
      },
      {
        "id": "110",
        "hexId": "6D",
        "name": "Bagpipe",
        "name_german": "Dudelsack"
      },
      {
        "id": "111",
        "hexId": "6E",
        "name": "Fiddle",
        "name_german": ""
      },
      {
        "id": "112",
        "hexId": "6F",
        "name": "Shanai",
        "name_german": "Shehnai"
      },
      {
        "id": "Percussive",
        "hexId": "",
        "name": "",
        "name_german": ""
      },
      {
        "id": "113",
        "hexId": "70",
        "name": "Tinkle Bell",
        "name_german": ""
      },
      {
        "id": "114",
        "hexId": "71",
        "name": "Agogo",
        "name_german": "Agogô"
      },
      {
        "id": "115",
        "hexId": "72",
        "name": "Steel Drums",
        "name_german": ""
      },
      {
        "id": "116",
        "hexId": "73",
        "name": "Woodblock",
        "name_german": "Holzblock"
      },
      {
        "id": "117",
        "hexId": "74",
        "name": "Taiko Drum",
        "name_german": "Taiko"
      },
      {
        "id": "118",
        "hexId": "75",
        "name": "Melodic Tom",
        "name_german": ""
      },
      {
        "id": "119",
        "hexId": "76",
        "name": "Synth Drum",
        "name_german": "Synthetische Trommel"
      },
      {
        "id": "120",
        "hexId": "77",
        "name": "Reverse Cymbal",
        "name_german": ""
      },
      {
        "id": "Sound effects",
        "hexId": "",
        "name": "",
        "name_german": ""
      },
      {
        "id": "121",
        "hexId": "78",
        "name": "Guitar Fret Noise",
        "name_german": ""
      },
      {
        "id": "122",
        "hexId": "79",
        "name": "Breath Noise",
        "name_german": "Atemgeräusche"
      },
      {
        "id": "123",
        "hexId": "7A",
        "name": "Seashore",
        "name_german": "Meeresgeräusche"
      },
      {
        "id": "124",
        "hexId": "7B",
        "name": "Bird Tweet",
        "name_german": "Vogelzwitschern"
      },
      {
        "id": "125",
        "hexId": "7C",
        "name": "Telephone Ring",
        "name_german": "Telefonklingeln"
      },
      {
        "id": "126",
        "hexId": "7D",
        "name": "Helicopter",
        "name_german": "Helikopter"
      },
      {
        "id": "127",
        "hexId": "7E",
        "name": "Applause",
        "name_german": "Applaus"
      },
      {
        "id": "128",
        "hexId": "7F",
        "name": "Gunshot",
        "name_german": "Pistolenschuss"
      }
    ]
}
