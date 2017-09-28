var mongoose = require('mongoose')
var promise = require('bluebird')

mongoose.Promise = promise

mongoose.connect('mongodb://localhost:27017/test-graphql',{
  useMongoClient: true
})

mongoose.connection.on('connected', function () {  
  console.log('MONGODB CONECTADO')
}) 

mongoose.connection.on('error',function (err) {  
  console.log('MONGODB error: ' + err)
}) 

mongoose.connection.on('disconnected', function () {  
  console.log('MONGODB DESCONECTADO') 
})

const CarreraSchema = new mongoose.Schema({
  codigo: { type: String, unique: true },
	nombre: { type: String }
},{
  timestamps: true
})

const MateriaSchema = new mongoose.Schema({
  codigo: { type: String, unique: true },
	nombre: { type: String }
},{
  timestamps: true
})

const ContenidoSchema = new mongoose.Schema({
	_id_carrera: { type: String },
  _id_materia: { type: String }
},{
  timestamps: true
})

const AlumnoSchema = new mongoose.Schema({
  cedula: { type: String, unique: true },
	nombre: { type: String },
	apellido: { type: String },
	correo: { type: String, unique: true },
  clave: { type: String }
},{
  timestamps: true
})

const EstudioSchema = new mongoose.Schema({
  _id_carrera: { type: String },
	_id_alumno: { type: String },
	estado: { type: Number }
},{
  timestamps: true
})

const PeriodoSchema = new mongoose.Schema({
	codigo: { type: String, unique: true },
	desde: { type: Date },
	hasta: { type: Date },
	gracia: { type: Number } // tiempo (en dias) de gracia para hacer cambios post periodo
},{
  timestamps: true
})

const CursarSchema = new mongoose.Schema({
  _id_periodo: { type: String },
	_id_estudio: { type: String }
},{
  timestamps: true
})

const ProfesorSchema = new mongoose.Schema({
  cedula: { type: String, unique: true },
	nombre: { type: String },
	apellido: { type: String },
	correo: { type: String, unique: true },
  clave: { type: String }
},{
  timestamps: true
})

const AsignaturaSchema = new mongoose.Schema({
  _id_periodo: { type: String },
	_id_profesor: { type: String },
  _id_materia: { type: String }
},{
  timestamps: true
})

const HorarioSchema = new mongoose.Schema({
  dia: { type: Number },
	desde: { type: Date },
  hasta: { type: Date },
  detalle: { type: String },
  _id_asignatura: { type: String }
},{
  timestamps: true
})

const EvaluacionSchema = new mongoose.Schema({
  contenido: { type: String },
  porcentaje: { type: Number },
  fecha: { type: Date },
  _id_asignatura: { type: String }
},{
  timestamps: true
})

const ClaseSchema = new mongoose.Schema({
  _id_cursar: { type: String },
	_id_asignatura: { type: String }
},{
  timestamps: true
})

const NotaSchema = new mongoose.Schema({
  calificacion: { type: Number },
  _id_evaluacion: { type: String },
	_id_clase: { type: String }
},{
  timestamps: true
})

const PersonalSchema = new mongoose.Schema({
  cedula: { type: String, unique: true },
	nombre: { type: String },
	apellido: { type: String },
	correo: { type: String, unique: true },
  grado: { type: Number },
  clave: { type: String }
},{
  timestamps: true
})

mongoose.model('carrera', CarreraSchema)
mongoose.model('materia', MateriaSchema)
mongoose.model('contenido', ContenidoSchema)
mongoose.model('alumno', AlumnoSchema)
mongoose.model('estudio', EstudioSchema)
mongoose.model('periodo', PeriodoSchema)
mongoose.model('cursar', CursarSchema)
mongoose.model('profesor', ProfesorSchema)
mongoose.model('asignatura', AsignaturaSchema)
mongoose.model('horario', HorarioSchema)
mongoose.model('evaluacion', EvaluacionSchema)
mongoose.model('clase', ClaseSchema)
mongoose.model('nota', NotaSchema)
mongoose.model('personal', PersonalSchema)

module.exports = mongoose
