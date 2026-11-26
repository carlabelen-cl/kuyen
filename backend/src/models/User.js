
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    edad: {
      type: Number,
      required: true,
      min: 1,
    },

    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    perfilClinico: {
      diagnosticos: {
        type: [String],
        default: [],
        enum: ['Endometriosis', 'Adenomiosis', 'SOMP'],
      },

      etapa: {
        type: String,
        default: null,
      },

      antiguedad: {
        type: String,
        default: null,
      },

      sintomas: {
        type: [String],
        default: [],
      },

      onboardingCompleto: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
