module.exports = function addEmitDeclaration(context) {
  const {
    j,
    root
  } = context;
  const vModel = root
    .find(j.ObjectProperty, {
      key: {
        name: 'model'
      }
    })
    .filter(p => p.parentPath.parentPath.parentPath.node.type == 'ExportDefaultDeclaration')
    .at(0);

  if (!vModel.length) return
  const propNd = vModel.find(j.ObjectProperty, {
    key: {
      name: 'prop'
    }
  }).get();
  const eventNd = vModel.find(j.ObjectProperty, {
    key: {
      name: 'event'
    }
  }).get();
  const propName = propNd.node.value.value
  const propEvent = eventNd.node.value.value

  const props = root
    .find(j.ObjectProperty, {
      key: {
        name: 'props'
      }
    })
    .filter(p => p.parentPath.parentPath.parentPath.node.type == 'ExportDefaultDeclaration')
    .at(0);

  if (!props.length) return
  const valueNd = props.find(j.ObjectProperty, {
      key: {
        name: 'value'
      }
    })
    .filter(p => p.parentPath.parentPath.parentPath == props.get())
    .get();

  valueNd.node.key.name = 'modelValue'

  let methods = root
    .find(j.ObjectProperty, {
      key: {
        name: 'methods'
      }
    })
    .filter(p => p.parentPath.parentPath.parentPath.node.type == 'ExportDefaultDeclaration')
    .at(0);


  if (!methods.length) {
    vModel.get().parentPath.value.push(
      j.objectProperty(j.identifier('methods'), j.objectExpression([]))
    )
  }
  methods = root
    .find(j.ObjectProperty, {
      key: {
        name: 'methods'
      }
    })
    .filter(p => p.parentPath.parentPath.parentPath.node.type == 'ExportDefaultDeclaration')
    .at(0);

  const funNd = j(`
        export default {
          ${propEvent}${propName}(${propName}){
            this.$emit('update:modelValue', ${propName})
          }}`).find(j.ObjectMethod).__paths[0].value

  methods.get().node.value.properties.push(funNd)

  vModel.remove()


  const peopDel = props.find(j.ObjectProperty, {
      key: {
        name: propName
      }
    })
    .filter(p => p.parentPath.parentPath.parentPath == props.get())
    .at(0);
  peopDel.remove()
}