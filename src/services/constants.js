export const UNITS = {
  LENGTH: ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
  WEIGHT: ['KILOGRAM', 'GRAM', 'POUND'],
  VOLUME: ['LITRE', 'MILLILITRE', 'GALLON'],
  TEMPERATURE: ['CELSIUS', 'FAHRENHEIT'],
}

export const MEASUREMENT_TYPES = ['LENGTH', 'WEIGHT', 'VOLUME', 'TEMPERATURE']

// Temperature doesn't support arithmetic
export const ARITHMETIC_TYPES = ['LENGTH', 'WEIGHT', 'VOLUME']

export const OPERATIONS = ['COMPARE', 'CONVERT', 'ADD', 'SUBTRACT', 'DIVIDE']

export const OP_COLORS = {
  COMPARE: 'primary',
  CONVERT: 'info',
  ADD: 'success',
  SUBTRACT: 'warning',
  DIVIDE: 'secondary',
}

export const OP_ICONS = {
  COMPARE: 'bi-arrow-left-right',
  CONVERT: 'bi-arrow-repeat',
  ADD: 'bi-plus-circle',
  SUBTRACT: 'bi-dash-circle',
  DIVIDE: 'bi-slash-circle',
}
