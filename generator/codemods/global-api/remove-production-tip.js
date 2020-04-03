/**
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
module.exports = function removeProductionTip({ j, root }) {
  const productionTipAssignment = root.find(
    j.AssignmentExpression,
    n =>
      j.MemberExpression.check(n.left) &&
      n.left.property.name === 'productionTip' &&
      n.left.object.property.name === 'config' &&
      n.left.object.object.name === 'Vue'
  )
  productionTipAssignment.remove()
}
