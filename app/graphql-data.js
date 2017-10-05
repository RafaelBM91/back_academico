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
const Coordinadordb = mongoose.model('coordinador')
const Administradordb = mongoose.model('administrador')

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
    correo: { type: GraphQLString },
    nombre: { type: GraphQLString },
		apellido: { type: GraphQLString },
    sexo: { type: GraphQLString },
		direccion: { type: GraphQLString },
		telefono: { type: GraphQLString },
    image: { type: GraphQLString },
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
    correo: { type: GraphQLString },
    nombre: { type: GraphQLString },
		apellido: { type: GraphQLString },
    sexo: { type: GraphQLString },
		direccion: { type: GraphQLString },
		telefono: { type: GraphQLString },
    image: { type: GraphQLString },
		clave: { type: GraphQLString }
  }
})

const Horario = new GraphQLObjectType({
  name: "Horario",
  fields: {
    _id: { type: GraphQLID },
		dia: { type: GraphQLInt },
		desde: { type: GraphQLString },
		hasta: { type: GraphQLString },
		detalle: { type: GraphQLString }
  }
})

const Asignatura = new GraphQLObjectType({
  name: "Asignatura",
  fields: {
    _id: { type: GraphQLID },
		periodo: {
			type: Periodo,
			args: {},
			resolve: (_,{}) =>
				Periododb.findOne({ _id: _._id_periodo })
		},
		profesor: {
			type: Profesor,
			args: {},
			resolve: (_,{}) =>
				Profesordb.findOne({ _id: _._id_profesor })
		},
		materia: {
			type: Materia,
			args: {},
			resolve: (_,{}) =>
				Materiadb.findOne({ _id: _._id_materia })
		},
		horario: {
			type: Horario,
			args: {},
			resolve: (_,{}) =>
				Horariodb.findOne({ _id_asignatura: _._id })
		},
  }
})

const Evaluacion = new GraphQLObjectType({
  name: "Evaluacion",
  fields: {
    _id: { type: GraphQLID },
		contenido: { type: GraphQLString },
		porcentaje: { type: GraphQLInt },
		fecha: { type: GraphQLString },
		asignatura: {
			type: Asignatura,
			args: {},
			resolve: (_,{}) =>
				Asignaturadb.findOne({ _id: _._id_asignatura })
		},
  }
})

const Clase = new GraphQLObjectType({
  name: "Clase",
  fields: {
    _id: { type: GraphQLID },
		cursar: {
			type: Cursar,
			args: {},
			resolve: (_,{}) =>
				Cursardb.findOne({ _id: _._id_cursar })
		},
		asignatura: {
			type: Asignatura,
			args: {},
			resolve: (_,{}) =>
				Asignaturadb.findOne({ _id: _._id_asignatura })
		}
  }
})

const Nota = new GraphQLObjectType({
  name: "Nota",
  fields: {
    _id: { type: GraphQLID },
		calificacion: { type: GraphQLFloat },
		evaluacion: {
			type: Evaluacion,
			args: {},
			resolve: (_,{}) =>
				Evaluaciondb.findOne({ _id: _._id_evaluacion })
		},
		clase: {
			type: Clase,
			args: {},
			resolve: (_,{}) =>
				Clasedb.findOne({ _id: _._id_clase })
		}
  }
})

const Coordinador = new GraphQLObjectType({
  name: "Coordinador",
  fields: {
    _id: { type: GraphQLID },
    cedula: { type: GraphQLString },
    correo: { type: GraphQLString },
    nombre: { type: GraphQLString },
		apellido: { type: GraphQLString },
    sexo: { type: GraphQLString },
		direccion: { type: GraphQLString },
		telefono: { type: GraphQLString },
    image: { type: GraphQLString },
		clave: { type: GraphQLString } 
  }
})

const Administrador = new GraphQLObjectType({
  name: "Administrador",
  fields: {
    _id: { type: GraphQLID },
    cedula: { type: GraphQLString },
    correo: { type: GraphQLString },
    nombre: { type: GraphQLString },
		apellido: { type: GraphQLString },
    sexo: { type: GraphQLString },
		direccion: { type: GraphQLString },
		telefono: { type: GraphQLString },
    image: { type: GraphQLString },
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
      resolve: (_,{},rootValue) => /*{
        console.log({ rootValue: { session } })
        Carreradb.find({})
      }*/
      Auth(rootValue.session.auth,[1,2,3],
        Carreradb.find({})
      )
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
    alumno_auth: {
			description: 'alumno autenticacion por correo y clave',
			type: Alumno,
      args: {
				correo: { type: new GraphQLNonNull(GraphQLString) },
        clave: { type: new  GraphQLNonNull(GraphQLString) }
			},
      resolve: (_,{correo,clave}) => Alumnodb.findOne({ correo, clave })
		},
		carrera_alumno_estado: {
			description: 'alumnos en carrera por _id carrera y estado de estudio',
			type: new GraphQLList(Estudio),
      args: {
				estado: { type: new GraphQLNonNull(GraphQLInt) },
				_id_carrera: { type: new GraphQLNonNull(GraphQLID) }
			},
      resolve: (_,{estado,_id_carrera}) => Estudiodb.find({ estado, _id_carrera })
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
		profesor: {
			description: 'profesor por cedula',
			type: Profesor,
      args: {
				cedula: { type: new GraphQLNonNull(GraphQLString) },
			},
      resolve: (_,{cedula}) => Profesordb.findOne({ cedula })
		},
    profesor_auth: {
			description: 'profesor autenticacion por correo y clave',
			type: Profesor,
      args: {
				correo: { type: new GraphQLNonNull(GraphQLString) },
        clave: { type: new GraphQLNonNull(GraphQLString) }
			},
      resolve: (_,{correo,clave}) => Profesordb.findOne({ correo, clave })
		},
		asignatura_of_periodo: {
			description: 'asignatura por periodo',
			type: new GraphQLList(Asignatura),
      args: {
				_id_periodo: { type: new GraphQLNonNull(GraphQLID) },
			},
      resolve: (_,{_id_periodo}) => Asignaturadb.find({ _id_periodo })
		},
		asignatura_of_profesor: {
			description: 'asignatura por profesor',
			type: new GraphQLList(Asignatura),
      args: {
				_id_profesor: { type: new GraphQLNonNull(GraphQLID) },
			},
      resolve: (_,{_id_profesor}) => Asignaturadb.find({ _id_profesor })
		},
		asignatura_of_materia: {
			description: 'asignatura por materia',
			type: new GraphQLList(Asignatura),
      args: {
				_id_materia: { type: new GraphQLNonNull(GraphQLID) },
			},
      resolve: (_,{_id_materia}) => Asignaturadb.find({ _id_materia })
		},
		horario_of_asignatura: {
			description: 'horario por asignatura',
			type: new GraphQLList(Horario),
      args: {
				_id_asignatura: { type: new GraphQLNonNull(GraphQLID) },
			},
      resolve: (_,{_id_asignatura}) => Horariodb.find({ _id_asignatura })
		},
		evaluacion_of_asignatura: {
			description: 'evaluacion por asignatura',
			type: new GraphQLList(Evaluacion),
      args: {
				_id_asignatura: { type: new GraphQLNonNull(GraphQLID) },
			},
      resolve: (_,{_id_asignatura}) => Evaluaciondb.find({ _id_asignatura })
		},
		clase_of_cursar: {
			description: 'clases por cursar',
			type: new GraphQLList(Clase),
      args: {
				_id_cursar: { type: new GraphQLNonNull(GraphQLID) },
			},
      resolve: (_,{_id_cursar}) => Clasedb.find({ _id_cursar })
		},
		clase_of_asignatura: {
			description: 'clases por asignaturas',
			type: new GraphQLList(Clase),
      args: {
				_id_asignatura: { type: new GraphQLNonNull(GraphQLID) },
			},
      resolve: (_,{_id_asignatura}) => Clasedb.find({ _id_asignatura })
		},
		nota_of_clase: {
			description: 'nota por clase',
			type: new GraphQLList(Nota),
      args: {
				_id_clase: { type: new GraphQLNonNull(GraphQLID) },
			},
      resolve: (_,{_id_clase}) => Notadb.find({ _id_clase })
		},
    coordinador: {
			description: 'coordinador por cedula',
			type: Coordinador,
			args: {
				cedula: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: (_,{cedula}) => Coordinadordb.findOne({ cedula })
		},
		coordinador_auth: {
			description: 'coordinador autenticacion por correo y clave',
			type: Coordinador,
			args: {
				correo: { type: new GraphQLNonNull(GraphQLString) },
				clave: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: (_,{correo,clave}) => Coordinadordb.findOne({ correo, clave })
		},
    administrador: {
			description: 'administrador por cedula',
			type: Administrador,
			args: {
				cedula: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: (_,{cedula}) => Administradordb.findOne({ cedula })
		},
    administrador_auth: {
			description: 'coordinador autenticacion por correo y clave',
			type: Administrador,
			args: {
				correo: { type: new GraphQLNonNull(GraphQLString) },
				clave: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: (_,{correo,clave}) => Administradordb.findOne({ correo, clave })
		}
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
        correo: { type: new GraphQLNonNull(GraphQLString) },
				nombre: { type: new GraphQLNonNull(GraphQLString) },
				apellido: { type: new GraphQLNonNull(GraphQLString) },
        sexo: { type: new GraphQLNonNull(GraphQLString) },
				direccion: { type: new GraphQLNonNull(GraphQLString) },
				telefono: { type: new GraphQLNonNull(GraphQLString) },
				clave: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: (_,{cedula,correo,nombre,apellido,sexo,direccion,telefono,clave}) =>
				Alumnodb.update(
					{ cedula },
					{ cedula, correo, nombre, apellido, sexo, direccion, telefono, clave },
					{ upsert: true, new: true, safe: true, returnNewDocument: true }
				)
		},
    alumno_image: {
      type: Alumno,
      args: {
        _id_alumno: { type: new GraphQLNonNull(GraphQLID) },
        image: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (_,{_id_alumno,image}) =>
        Alumnodb.update(
          { _id: _id_alumno },
          { $set: { image } },
          { upsert: true, new: true, safe: true, returnNewDocument: true }
        )
    },
    remove_alumno: {
			description: 'elimina alumno',
			type: Alumno,
			args: {
				_id_alumno: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{_id_alumno}) =>
				Alumnodb.findByIdAndRemove({ _id: _id_alumno })
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
        correo: { type: new GraphQLNonNull(GraphQLString) },
				nombre: { type: new GraphQLNonNull(GraphQLString) },
				apellido: { type: new GraphQLNonNull(GraphQLString) },
        sexo: { type: new GraphQLNonNull(GraphQLString) },
				direccion: { type: new GraphQLNonNull(GraphQLString) },
				telefono: { type: new GraphQLNonNull(GraphQLString) },
				clave: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: (_,{cedula,correo,nombre,apellido,sexo,direccion,telefono,clave}) =>
				Profesordb.update(
					{ cedula },
					{ cedula, correo, nombre, apellido, sexo, direccion, telefono, clave },
					{ upsert: true, new: true, safe: true, returnNewDocument: true }
				)
		},
    profesor_image: {
      type: Profesor,
      args: {
        _id_profesor: { type: new GraphQLNonNull(GraphQLID) },
        image: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (_,{_id_profesor,image}) =>
        Profesordb.update(
          { _id: _id_profesor },
          { $set: { image } },
          { upsert: true, new: true, safe: true, returnNewDocument: true }
        )
    },
		remove_profesor: {
			description: 'elimina profesor',
			type: Profesor,
			args: {
				_id_profesor: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{_id_profesor}) =>
				Profesordb.findByIdAndRemove({ _id: _id_profesor })
		},
		asignatura: {
			description: 'crea asignatura',
			type: Asignatura,
			args: {
				_id_periodo: { type: new GraphQLNonNull(GraphQLID) },
				_id_profesor: { type: new GraphQLNonNull(GraphQLID) },
				_id_materia: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{_id_periodo,_id_profesor,_id_materia}) =>
				Asignaturadb.create({ _id_periodo, _id_profesor, _id_materia })
		},
		remove_asignatura: {
			description: 'elimina asignatura',
			type: Asignatura,
			args: {
				_id_asignatura: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: (_,{_id_asignatura}) =>
				Asignaturadb.findByIdAndRemove({ _id: _id_asignatura })
		},
		horario: {
			type: Horario,
			args: {
				dia: { type: new GraphQLNonNull(GraphQLInt) },
				desde: { type: new GraphQLNonNull(GraphQLString) },
				hasta: { type: new GraphQLNonNull(GraphQLString) },
				detalle: { type: new GraphQLNonNull(GraphQLString) },
				_id_asignatura: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{dia,desde,hasta,detalle,_id_asignatura}) =>
				Horariodb.create({ dia, desde, hasta, detalle, _id_asignatura })
		},
		remove_horario: {
			type: Horario,
			args: {
				_id_horario: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{_id_horario}) =>
				Horariodb.findByIdAndRemove({ _id: _id_horario })
		},
		evaluacion: {
			description: 'crear evaluacion',
			type: Evaluacion,
			args: {
				contenido: { type: new GraphQLNonNull(GraphQLString) },
				porcentaje: { type: new GraphQLNonNull(GraphQLInt) },
				fecha: { type: new GraphQLNonNull(GraphQLString) },
				_id_asignatura: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{contenido,porcentaje,fecha,_id_asignatura}) =>
				Evaluaciondb.create({ contenido, porcentaje, fecha, _id_asignatura })
		},
		remove_evaluacion: {
			type: Evaluacion,
			args: {
				_id_evaluacion: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{_id_evaluacion}) =>
				Evaluaciondb.findByIdAndRemove({ _id: _id_evaluacion })
		},
		clase: {
			type: Clase,
			args: {
				_id_cursar: { type: new GraphQLNonNull(GraphQLID) },
				_id_asignatura: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{_id_cursar,_id_asignatura}) =>
				Clasedb.create({ _id_cursar, _id_asignatura })
		},
		remove_clase: {
			type: Clase,
			args: {
				_id_clase: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{_id_clase}) =>
				Clasedb.findByIdAndRemove({ _id: _id_clase })
		},
		nota: {
			type: Nota,
			args: {
				calificacion: { type: new GraphQLNonNull(GraphQLFloat) },
				_id_evaluacion: { type: new GraphQLNonNull(GraphQLID) },
				_id_clase: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: (_,{calificacion,_id_evaluacion,_id_clase}) =>
				Notadb.create({ calificacion, _id_evaluacion, _id_clase })
		},
		remove_nota: {
			type: Nota,
			args: {
				_id_nota: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{_id_nota}) =>
				Notadb.findByIdAndRemove({ _id: _id_nota })
		},
		coordinador: {
			description: 'crear-editar coordinador',
			type: Coordinador,
			args: {
				cedula: { type: new GraphQLNonNull(GraphQLString) },
        correo: { type: new GraphQLNonNull(GraphQLString) },
				nombre: { type: new GraphQLNonNull(GraphQLString) },
				apellido: { type: new GraphQLNonNull(GraphQLString) },
        sexo: { type: new GraphQLNonNull(GraphQLString) },
				direccion: { type: new GraphQLNonNull(GraphQLString) },
				telefono: { type: new GraphQLNonNull(GraphQLString) },
				clave: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: (_,{cedula,correo,nombre,apellido,sexo,direccion,telefono,clave}) =>
				Coordinadordb.update(
					{ cedula },
					{ cedula, correo, nombre, apellido, sexo, direccion, telefono, clave },
					{ upsert: true, new: true, safe: true, returnNewDocument: true }
				)
		},
    coordinador_image: {
      type: Coordinador,
      args: {
        _id_coordinador: { type: new GraphQLNonNull(GraphQLID) },
        image: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (_,{_id_coordinador,image}) =>
        Coordinadordb.update(
          { _id: _id_coordinador },
          { $set: { image } },
          { upsert: true, new: true, safe: true, returnNewDocument: true }
        )
    },
		remove_coordinador: {
			description: 'elimina coordinador',
			type: Coordinador,
			args: {
				_id_coordinador: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{_id_coordinador}) =>
				Coordinadordb.findByIdAndRemove({ _id: _id_coordinador })
		},
    administrador: {
			description: 'crear-editar administrador',
			type: Administrador,
			args: {
				cedula: { type: new GraphQLNonNull(GraphQLString) },
        correo: { type: new GraphQLNonNull(GraphQLString) },
				nombre: { type: new GraphQLNonNull(GraphQLString) },
				apellido: { type: new GraphQLNonNull(GraphQLString) },
        sexo: { type: new GraphQLNonNull(GraphQLString) },
				direccion: { type: new GraphQLNonNull(GraphQLString) },
				telefono: { type: new GraphQLNonNull(GraphQLString) },
				clave: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: (_,{cedula,correo,nombre,apellido,sexo,direccion,telefono,clave}) =>
				Administradordb.update(
					{ cedula },
					{ cedula, correo, nombre, apellido, sexo, direccion, telefono, clave },
					{ upsert: true, new: true, safe: true, returnNewDocument: true }
				)
		},
    administrador_image: {
      type: Administrador,
      args: {
        _id_administrador: { type: new GraphQLNonNull(GraphQLID) },
        image: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (_,{_id_administrador,image}) =>
        Administradordb.update(
          { _id: _id_administrador },
          { $set: { image } },
          { upsert: true, new: true, safe: true, returnNewDocument: true }
        )
    },
		remove_administrador: {
			description: 'elimina administrador',
			type: Administrador,
			args: {
				_id_administrador: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (_,{_id_administrador}) =>
				Administradordb.findByIdAndRemove({ _id: _id_administrador })
		},
	}
})

const Auth = (auth,perm,data) => {
  console.log( auth )
  if (auth) {
    const grado = Number(auth.grado)
    if (typeof grado === "number" && grado > 0) {
      if(perm.indexOf(grado) > -1) {
        return data
      }
    }
  }
  return null
}

module.exports = new GraphQLSchema({
  query: Query,
	mutation: Mutation,
})
