
const mongoose = require('mongoose');

const symptomCategorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    titulo: {
      type: String,
      required: true,
      trim: true,
    },

    icono: {
      type: String,
      required: true,
    },

    afinidad: {
      type: [String],
      enum: ['Endometriosis', 'Adenomiosis', 'SOMP'],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SymptomCategory', symptomCategorySchema);
