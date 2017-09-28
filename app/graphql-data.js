const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull,
	GraphQLInt,
	GraphQLFloat
} = require('graphql')

const mongoose = require('./mongodb')

const Carreradb = mongoose.model('carrera')
const Materiadb = mongoose.model('materia')
const Contenidodb = mongoose.model('contenido')
const Alumnodb = mongoose.model('alumno')
const Estudiodb = mongoose.model('estudio')
const Periododb = mongoose.model('periodo')
const Cursardb = mongoose.model('cursar')
const Profesordb = mongoose.model('profesor')
const Asignaturadb = mongoose.model('asignatura')
const Horariodb = mongoose.model('horario')
const Evaluaciondb = mongoose.model('evaluacion')
const Clasedb = mongoose.model('clase')
const Notadb = mongoose.model('nota')
const Personaldb = mongoose.model('personal')

const Carrera = new GraphQLObjectType({
  name: "Carrera",
  fields: {
    _id: { type: GraphQLID },
    codigo: { type: GraphQLString },
		nombre: { type: GraphQLString }
  }
})

const Materia = new GraphQLObjectType({
  name: "Materia",
  fields: {
    _id: { type: GraphQLID },
    codigo: { type: GraphQLString },
		nombre: { type: GraphQLString }
  }
})

const Contenido = new GraphQLObjectType({
  name: "Contenido",
  fields: {
    _id: { type: GraphQLID },
		carrera: {
			type: Carrera,
			args: {},
			resolve: (_,{}) => Carreradb.findOne({ _id: _._id_carrera })
		},
		materia: {
			type: Materia,
			args: {},
			resolve: (_,{}) => Materiadb.findOne({ _id: _._id_materia })
		}
  }
})

const Alumno = new GraphQLObjectType({
  name: "Alumno",
  fields: {
    _id: { type: GraphQLID },
    cedula: { type: GraphQLString },
		nombre: { type: GraphQLString },
		apellido: { type: GraphQLString },
		correo: { type: GraphQLString },
		clave: { type: GraphQLString }
  }
})

const Estudio = new GraphQLObjectType({
  name: "Estudio",
  fields: {
    _id: { type: GraphQLID },
		estado: { type: GraphQLInt }, // 0 - retirado, 1 - congelado, 2 - egrsado, 3 - activo
		carrera: {
			type: Carrera,
			args: {},
			resolve: (_,{}) =>
				Carreradb.findOne({ _id: _._id_carrera })
		},
		alumno: {
			type: Alumno,
			args: {},
			resolve: (_,{}) =>
				Alumnodb.findOne({ _id: _._id_alumno })
		}
	}
})

const Periodo = new GraphQLObjectType({
  name: "Periodo",
  fields: {
    _id: { type: GraphQLID },
		codigo: { type: GraphQLID },
		desde: { type: GraphQLString },
		hasta: { type: GraphQLString },
		gracia: { type: GraphQLInt } // tiempo (en dias) de gracia para hacer cambios post periodo
  }
})

const Cursar = new GraphQLObjectType({
  name: "Cursar",
  fields: {
    _id: { type: GraphQLID },
		periodo: {
			type: Periodo,
			args: {},
			resolve: (_,{}) =>
				Periododb.findOne({ _id: _._id_periodo })
		},
		estudio: {
			type: Estudio,
			args: {},
			resolve: (_,{}) =>
				Estudiodb.findOne({ _id: _._id_estudio })
		}
  }
})

const Profesor = new GraphQLObjectType({
  name: "Profesor",
  fields: {
    _id: { type: GraphQLID },
    cedula: { type: GraphQLString },
		nombre: { type: GraphQLString },
		apellido: { type: GraphQLString },
		correo: { type: GraphQLString },
		clave: { type: GraphQLString }
  }
})

const Asignatura = new GraphQLObjectType({
  name: "Asignatura",
  fields: {
    _id: { type: GraphQLID },
		_id_periodo: { type: GraphQLID },
		_id_profesor: { type: GraphQLID },
		_id_materia: { type: GraphQLID },
  }
})

const Horario = new GraphQLObjectType({
  name: "Horario",
  fields: {
    _id: { type: GraphQLID },
		dia: { type: GraphQLInt },
		desde: { type: GraphQLString },
		hasta: { type: GraphQLString },
		detalle: { type: GraphQLString },
		_id_asignatura: { type: GraphQLID }
  }
})

const Evaluacion = new GraphQLObjectType({
  name: "Evaluacion",
  fields: {
    _id: { type: GraphQLID },
		contenido: { type: GraphQLString },
		porcentaje: { type: GraphQLInt },
		fecha: { type: GraphQLString },
		_id_asignatura: { type: GraphQLID }
  }
})

const Clase = new GraphQLObjectType({
  name: "Clase",
  fields: {
    _id: { type: GraphQLID },
		_id_cursar: { type: GraphQLID },
		_id_asignatura: { type: GraphQLID }
  }
})

const Nota = new GraphQLObjectType({
  name: "Nota",
  fields: {
    _id: { type: GraphQLID },
		calificacion: { type: GraphQLFloat },
		_id_evaluacion: { type: GraphQLID },
		_id_clase: { type: GraphQLID },
  }
})

const Personal = new GraphQLObjectType({
  name: "Personal",
  fields: {
    _id: { type: GraphQLID },
    cedula: { type: GraphQLString },
		nombre: { type: GraphQLString },
		apellido: { type: GraphQLString },
		correo: { type: GraphQLString },
		grado: { type: GraphQLInt },
		clave: { type: GraphQLString }
  }
})

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    carrera_all: {
			description: 'todas la carreras',
			type: new GraphQLList(Carrera),
      args: {},
      resolve: (_,{}) => Carreradb.find({})
		},
		materia_all: {
			description: 'todas las materias',
			type: new GraphQLList(Materia),
      args: {},
      resolve: (_,{}) => Materiadb.find({})
		},
		materia_of_carrera: {
			description: 'contenido por _id de carrera',
			type: new GraphQLList(Contenido),
      args: {
				_id_carrera: { type: new GraphQLNonNull(GraphQLID) }
			},
      resolve: (_,{_id_carrera}) => Contenidodb.find({ _id_carrera })
		},
		carrera_of_materia: {
			description: 'contenido por _id de materia',
			type: new GraphQLList(Contenido),
      args: {
				_id_materia: { type: new GraphQLNonNull(GraphQLID) }
			},
      resolve: (_,{_id_materia}) => Contenidodb.find({ _id_materia })
		},
		alumno: {
			description: 'alumno por cedula',
			type: Alumno,
      args: {
				cedula: { type: new GraphQLNonNull(GraphQLString) },
			},
      resolve: (_,{cedula}) => Alumnodb.findOne({ cedula })
		},
		carrera_alumno_estado: {
			description: 'alumnos en carrera por _id carrera y estado de estudio',
			type: new GraphQLList(Estudio),
      args: {
				estado: { type: new GraphQLNonNull(GraphQLInt) },
				_id_carrera: { type: new GraphQLNonNull(GraphQLID) }
			},
      resolve: (_,{_id_carrera}) => Estudiodb.find({ _id_carrera })
		},
		alumno_carrera: {
			description: 'carreras por alumno _id',
			type: new GraphQLList(Estudio),
      args: {
				_id_alumno: { type: new GraphQLNonNull(GraphQLID) }
			},
      resolve: (_,{_id_alumno}) => Estudiodb.find({ _id_alumno })
		},
		periodo: {
			description: 'periodo por codigo',
			type: Periodo,
      args: {
				codigo: { type: new GraphQLNonNull(GraphQLString) },
			},
      resolve: (_,{codigo}) => Periododb.findOne({ codigo })
		},
		alumnos_of_periodos: {
			description: 'alumnos que cursan el periodo',
			type: new GraphQLList(Cursar),
      args: {
				_id_periodo: { type: new GraphQLNonNull(GraphQLID) }
			},
      resolve: (_,{_id_periodo}) => Cursardb.find({ _id_periodo })
		},
		periodos_of_alumnos: {
			description: 'periodos que cursa (curso) el alumno',
			type: new GraphQLList(Cursar),
      args: {
				_id_estudio: { type: new GraphQLNonNull(GraphQLID) }
			},
      resolve: (_,{_id_estudio}) => Cursardb.find({ _id_estudio })
		},
  }
})

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
		carrera: {
			description: 'crear-editar carrera',
			type: Carrera,
			args: {
				codigo: { type: new GraphQLNonNull(GraphQLString) },
				nombre: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: (_,{codigo,nombre}) =>
				Carreradb.update(
					{ codigo },
					{ codigo, nombre },
					{ upsert: true, new: true, safe: true, returnNewDocument: true }
				)
		},
		materia: {
			description: 'crear-editar materia',
			type: Materia,
			args: {
				codigo: { type: new GraphQLNonNull(GraphQLString) },
				nombre: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: (_,{codigo,nombre}) =>
				Materiadb.update(
					{ codigo },
					{ codigo, nombre },
					{ upsert: true, new: true, safe: true, returnNewDocument: true }
				)
		},
		contenido: {
			description: 'crear-editar relacion materia - carrera',
			type: Contenido,
			args: {
				_id_carrera: { type: new GraphQLNonNull(GraphQLID) },
				_id_materia: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{_id_carrera,_id_materia}) =>
				Contenidodb.create({ _id_carrera, _id_materia })
		},
		alumno: {
			description: 'crear-editar alumno',
			type: Alumno,
			args: {
				cedula: { type: new GraphQLNonNull(GraphQLString) },
				nombre: { type: new GraphQLNonNull(GraphQLString) },
				apellido: { type: new GraphQLNonNull(GraphQLString) },
				correo: { type: new GraphQLNonNull(GraphQLString) },
				clave: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: (_,{cedula,nombre,apellido,correo,clave}) =>
				Alumnodb.update(
					{ cedula },
					{ cedula, nombre, apellido, correo, clave },
					{ upsert: true, new: true, safe: true, returnNewDocument: true }
				)
		},
		estudio: {
			description: 'crear relacion alumno - carrera',
			type: Estudio,
			args: {
				estado: { type: new GraphQLNonNull(GraphQLInt) },
				_id_carrera: { type: new GraphQLNonNull(GraphQLID) },
				_id_alumno: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{estado,_id_carrera,_id_alumno}) =>
				Estudiodb.create({ estado, _id_carrera, _id_alumno })
		},
		remove_estudio: {
			description: 'elimina relacion alumno - carrera',
			type: Estudio,
			args: {
				_id_estudio: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{_id_estudio}) =>
				Estudiodb.findByIdAndRemove({ _id: _id_estudio })
		},
		periodo: {
			description: 'crear-editar periodo',
			type: Periodo,
			args: {
				codigo: { type: new GraphQLNonNull(GraphQLString) },
				desde: { type: new GraphQLNonNull(GraphQLString) },
				hasta: { type: new GraphQLNonNull(GraphQLString) },
				gracia: { type: new GraphQLNonNull(GraphQLInt) }
			},
			resolve: (_,{codigo,desde,hasta,gracia}) =>
				Periododb.update(
					{ codigo },
					{ codigo, desde, hasta, gracia },
					{ upsert: true, new: true, safe: true, returnNewDocument: true }
				)
		},
		remove_periodo: {
			description: 'elimina periodo',
			type: Periodo,
			args: {
				_id_periodo: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{_id_periodo}) =>
				Periododb.findByIdAndRemove({ _id: _id_periodo })
		},
		cursar: {
			description: 'crear relacion periodo - estudio',
			type: Cursar,
			args: {
				_id_periodo: { type: new GraphQLNonNull(GraphQLID) },
				_id_estudio: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{_id_periodo,_id_estudio}) =>
				Cursardb.create({ _id_periodo, _id_estudio })
		},
		remove_cursar: {
			description: 'elimina relacion periodo - estudio',
			type: Cursar,
			args: {
				_id_cursar: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{_id_cursar}) =>
				Cursardb.findByIdAndRemove({ _id: _id_cursar })
		},
		profesor: {
			description: 'crear-editar profesor',
			type: Profesor,
			args: {
				cedula: { type: new GraphQLNonNull(GraphQLString) },
				nombre: { type: new GraphQLNonNull(GraphQLString) },
				apellido: { type: new GraphQLNonNull(GraphQLString) },
				correo: { type: new GraphQLNonNull(GraphQLString) },
				clave: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: (_,{cedula,nombre,apellido,correo,clave}) =>
				Profesordb.update(
					{ cedula },
					{ cedula, nombre, apellido, correo, clave },
					{ upsert: true, new: true, safe: true, returnNewDocument: true }
				)
		},
	}
})

module.exports = new GraphQLSchema({
  query: Query,
	mutation: Mutation,
})