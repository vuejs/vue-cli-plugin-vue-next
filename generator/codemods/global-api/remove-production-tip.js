module.exports = function removeProductionTip({ j, root }) {
  const productionTipAssignment = root.find(
    j.AssignmentExpression,
    n =>
      n.left.type === 'MemberExpression' &&
      n.left.property.name === 'productionTip' &&
      n.left.object.property.name === 'config' &&
      n.left.object.object.name === 'Vue'
  )
  productionTipAssignment.remove()
}
