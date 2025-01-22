

/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/sordle.json`.
 */
export type Sordle = {
  "address": "AXbHos5KU6EXyU59JDoFvFDTQ57CBtgiiEYfCWyeMzyp",
  "metadata": {
    "name": "sordle",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "play",
      "discriminator": [
        213,
        157,
        193,
        142,
        228,
        56,
        248,
        150
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.initiator",
                "account": "Game"
              }
            ]
          }
        },
        {
          "name": "game_session",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  115,
                  101,
                  115,
                  115,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "game.initiator",
                "account": "Game"
              },
              {
                "kind": "account",
                "path": "game.nonce",
                "account": "Game"
              }
            ]
          }
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "answer",
          "type": "string"
        }
      ]
    },
    {
      "name": "start_game",
      "discriminator": [
        249,
        47,
        252,
        172,
        184,
        162,
        245,
        14
      ],
      "accounts": [
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "player"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "upload_word",
      "discriminator": [
        115,
        21,
        234,
        46,
        50,
        65,
        144,
        39
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.initiator",
                "account": "Game"
              }
            ]
          }
        },
        {
          "name": "game_session",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  115,
                  101,
                  115,
                  115,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "game.initiator",
                "account": "Game"
              },
              {
                "kind": "account",
                "path": "game.nonce",
                "account": "Game"
              }
            ]
          }
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "UploadParams"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    },
    {
      "name": "Game",
      "discriminator": [
        27,
        90,
        166,
        125,
        74,
        100,
        121,
        18
      ]
    },
    {
      "name": "GameSession",
      "discriminator": [
        150,
        116,
        20,
        197,
        205,
        121,
        220,
        240
      ]
    }
  ],
  "events": [
    {
      "name": "StartGameEvent",
      "discriminator": [
        57,
        178,
        18,
        12,
        112,
        108,
        226,
        181
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotAuthorized",
      "msg": "You are not permit to do this operation"
    },
    {
      "code": 6001,
      "name": "NotValidWord",
      "msg": "This word is not valid"
    },
    {
      "code": 6002,
      "name": "AnswerAlreadySubmitted",
      "msg": "This word is already submitted"
    },
    {
      "code": 6003,
      "name": "GameStarted",
      "msg": "Game has started, can't upload jumble word"
    },
    {
      "code": 6004,
      "name": "UpdateTooSoon",
      "msg": "The game cannot be started as the last update was too recent."
    },
    {
      "code": 6005,
      "name": "MaxPlayersReached",
      "msg": "Maximum number of players reached"
    },
    {
      "code": 6006,
      "name": "GameOver",
      "msg": "Game over or not yet started"
    }
  ],
  "types": [
    {
      "name": "Config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "Game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "Status"
              }
            }
          },
          {
            "name": "nonce",
            "type": "u128"
          },
          {
            "name": "initiator",
            "type": "pubkey"
          },
          {
            "name": "last_update",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "GameScore",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player",
            "type": "pubkey"
          },
          {
            "name": "score",
            "type": "u8"
          },
          {
            "name": "answers",
            "type": {
              "vec": {
                "array": [
                  "u8",
                  6
                ]
              }
            }
          }
        ]
      }
    },
    {
      "name": "GameSession",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "jumble_world",
            "type": "string"
          },
          {
            "name": "valid_words",
            "type": {
              "vec": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          },
          {
            "name": "submitted_answers",
            "type": {
              "vec": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          },
          {
            "name": "game_scores",
            "type": {
              "vec": {
                "defined": {
                  "name": "GameScore"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "StartGameEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "program_id",
            "type": "pubkey"
          },
          {
            "name": "player",
            "type": "pubkey"
          },
          {
            "name": "nonce",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "Status",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "INITIATED"
          },
          {
            "name": "STARTED"
          },
          {
            "name": "IDLE"
          }
        ]
      }
    },
    {
      "name": "UploadParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "jumble_world",
            "type": "string"
          },
          {
            "name": "valid_words",
            "type": {
              "vec": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          }
        ]
      }
    }
  ]
}
export const IDL = {
  "address": "AXbHos5KU6EXyU59JDoFvFDTQ57CBtgiiEYfCWyeMzyp",
  "metadata": {
    "name": "sordle",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "play",
      "discriminator": [
        213,
        157,
        193,
        142,
        228,
        56,
        248,
        150
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.initiator",
                "account": "Game"
              }
            ]
          }
        },
        {
          "name": "game_session",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  115,
                  101,
                  115,
                  115,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "game.initiator",
                "account": "Game"
              },
              {
                "kind": "account",
                "path": "game.nonce",
                "account": "Game"
              }
            ]
          }
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "answer",
          "type": "string"
        }
      ]
    },
    {
      "name": "start_game",
      "discriminator": [
        249,
        47,
        252,
        172,
        184,
        162,
        245,
        14
      ],
      "accounts": [
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "player"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "upload_word",
      "discriminator": [
        115,
        21,
        234,
        46,
        50,
        65,
        144,
        39
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.initiator",
                "account": "Game"
              }
            ]
          }
        },
        {
          "name": "game_session",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  115,
                  101,
                  115,
                  115,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "game.initiator",
                "account": "Game"
              },
              {
                "kind": "account",
                "path": "game.nonce",
                "account": "Game"
              }
            ]
          }
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "UploadParams"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    },
    {
      "name": "Game",
      "discriminator": [
        27,
        90,
        166,
        125,
        74,
        100,
        121,
        18
      ]
    },
    {
      "name": "GameSession",
      "discriminator": [
        150,
        116,
        20,
        197,
        205,
        121,
        220,
        240
      ]
    }
  ],
  "events": [
    {
      "name": "StartGameEvent",
      "discriminator": [
        57,
        178,
        18,
        12,
        112,
        108,
        226,
        181
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotAuthorized",
      "msg": "You are not permit to do this operation"
    },
    {
      "code": 6001,
      "name": "NotValidWord",
      "msg": "This word is not valid"
    },
    {
      "code": 6002,
      "name": "AnswerAlreadySubmitted",
      "msg": "This word is already submitted"
    },
    {
      "code": 6003,
      "name": "GameStarted",
      "msg": "Game has started, can't upload jumble word"
    },
    {
      "code": 6004,
      "name": "UpdateTooSoon",
      "msg": "The game cannot be started as the last update was too recent."
    },
    {
      "code": 6005,
      "name": "MaxPlayersReached",
      "msg": "Maximum number of players reached"
    },
    {
      "code": 6006,
      "name": "GameOver",
      "msg": "Game over or not yet started"
    }
  ],
  "types": [
    {
      "name": "Config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "Game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "Status"
              }
            }
          },
          {
            "name": "nonce",
            "type": "u128"
          },
          {
            "name": "initiator",
            "type": "pubkey"
          },
          {
            "name": "last_update",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "GameScore",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player",
            "type": "pubkey"
          },
          {
            "name": "score",
            "type": "u8"
          },
          {
            "name": "answers",
            "type": {
              "vec": {
                "array": [
                  "u8",
                  6
                ]
              }
            }
          }
        ]
      }
    },
    {
      "name": "GameSession",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "jumble_world",
            "type": "string"
          },
          {
            "name": "valid_words",
            "type": {
              "vec": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          },
          {
            "name": "submitted_answers",
            "type": {
              "vec": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          },
          {
            "name": "game_scores",
            "type": {
              "vec": {
                "defined": {
                  "name": "GameScore"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "StartGameEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "program_id",
            "type": "pubkey"
          },
          {
            "name": "player",
            "type": "pubkey"
          },
          {
            "name": "nonce",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "Status",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "INITIATED"
          },
          {
            "name": "STARTED"
          },
          {
            "name": "IDLE"
          }
        ]
      }
    },
    {
      "name": "UploadParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "jumble_world",
            "type": "string"
          },
          {
            "name": "valid_words",
            "type": {
              "vec": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          }
        ]
      }
    }
  ]
}