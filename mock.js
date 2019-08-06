const fs = require('fs')
const path = require('path')

/**
 * @param {import('express').Application} app Express实例
 */
const mock = function (app) {
  app.all(/api/, (req, res) => {
    // mock路由，优先查找JS，其次是JSON，找不到返回默认值
    const JSFilePath = path.join(__dirname, './', `${req.path}.js`)
    const JSONFilePath = path.join(__dirname, './', `${req.path}.json`)

    if (fs.existsSync(JSFilePath)) {
      require(JSFilePath)(req, res)
    } else if (fs.existsSync(JSONFilePath)) {
      const file = fs.readFileSync(JSONFilePath)
      res.json(JSON.parse(file))
    } else {
      res.json({
        code: '000000',
        desc: '成功',
        data: '0',
        success: true
      })
    }
  })
}

module.exports = mock
