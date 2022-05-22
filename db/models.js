/* eslint-disable require-jsdoc */
const {Model} = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username'],

      properties: {
        id: {type: 'integer'},
        username: {type: 'string', minLength: 1, maxLength: 255},
        password: {type: 'string', minLength: 1, maxLength: 255},
        accessLevel: {type: 'integer'},
        exp: {type: 'integer'},
        sanity: {type: 'integer'},
        isBlocked: {type: 'boolean'},
      },
    };
  }

  static get relationMappings() {
    return {
      friends: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          through: {
            from: 'friends.userId',
            to: 'friends.friendId',
          },
          to: 'users.id',
        },
      },
      confirmations: {
        relation: Model.HasManyRelation,
        modelClass: Confirmation,
        join: {
          from: 'users.id',
          to: 'confirmations.userId',
        },
      },
      messages: {
        relation: Model.HasManyRelation,
        modelClass: ChatHistory,
        join: {
          from: 'users.id',
          to: 'chatHistory.userId',
        },
      },
      ip: {
        relation: Model.HasManyRelation,
        modelClass: IpHistory,
        join: {
          from: 'users.id',
          to: 'ipHistory.userId',
        },
      },
      illegals: {
        relation: Model.HasManyRelation,
        modelClass: IllegalActions,
        join: {
          from: 'users.id',
          to: 'illegalActions.userId',
        },
      },
    };
  }
}


class Confirmation extends Model {
  static get tableName() {
    return 'confirmations';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'type'],

      properties: {
        id: {type: 'integer'},
        userId: {type: 'integer'},
        type: {type: 'string', minLength: 1, maxLength: 127},
        text: {type: 'string', minLength: 0, maxLength: 255},
        parameters: {type: 'string', minLength: 0, maxLength: 255},
        claimed: {type: 'boolean'},
      },
    };
  }
}

class Chat extends Model {
  static get tableName() {
    return 'chats';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'type'],

      properties: {
        id: {type: 'integer'},
        name: {type: 'string', minLength: 1, maxLength: 255},
        type: {type: 'string', minLength: 1, maxLength: 255},
        describe: {type: 'string', minLength: 0, maxLength: 255},
        password: {type: 'string', minLength: 0, maxLength: 255},
      },
    };
  }

  static get relationMappings() {
    return {
      messages: {
        relation: Model.HasManyRelation,
        modelClass: ChatHistory,
        join: {
          from: 'chats.id',
          to: 'chatHistory.chatId',
        },
      },
    };
  }
};

class ChatHistory extends Model {
  $beforeInsert() {
    this.createAt = new Date().toISOString();
  }

  static get tableName() {
    return 'chatHistory';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['chatId', 'userId', 'content'],

      properties: {
        id: {type: 'integer'},
        chatId: {type: 'integer'},
        userId: {type: 'integer'},
        content: {type: 'string', minLength: 1, maxLength: 255},
        createAt: {type: 'string', minLength: 1, maxLength: 255},
      },
    };
  }

  static get relationMappings() {
    return {
      chat: {
        relation: Model.BelongsToOneRelation,
        modelClass: Chat,
        join: {
          from: 'chatHistory.chatId',
          to: 'chats.id',
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'chatHistory.userId',
          to: 'users.id',
        },
      },
    };
  }
}

class IpHistory extends Model {
  static get tableName() {
    return 'ipHistory';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'ip'],

      properties: {
        userId: {type: 'integer'},
        ip: {type: 'string', minLength: 1, maxLength: 127},

      },
    };
  }
}

class IllegalActions extends Model {
  static get tableName() {
    return 'illegalActions';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ip', 'type'],

      properties: {
        userId: {type: 'integer'},
        type: {type: 'string', minLength: 1, maxLength: 127},
        content: {type: 'string', minLength: 0, maxLength: 127},
      },
    };
  }
}

class Setting extends Model {
  static get tableName() {
    return 'settings';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'type', 'describe', 'value'],

      properties: {
        id: {type: 'integer'},
        name: {type: 'string', minLength: 1, maxLength: 255},
        type: {type: 'string', minLength: 1, maxLength: 255},
        describe: {type: 'string', minLength: 1, maxLength: 255},
        value: {type: 'integer'},
      },
    };
  }
}

class Asset extends Model {
  static get tableName() {
    return 'assets';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'value', 'uri', 'marketName'],

      properties: {
        id: {type: 'integer'},
        marketName: {type: 'string', minLength: 1, maxLength: 255},
        uri: {type: 'string'},
        name: {type: 'string', minLength: 1, maxLength: 255},
        value: {type: 'integer'},
        ownerId: {type: 'integer'},
      },
    };
  }

  static get relationMappings() {
    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'assets.ownerId',
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = {
  User,
  Confirmation,
  ChatHistory,
  Chat,
  Setting,
  IpHistory,
  IllegalActions,
  Asset,
};
