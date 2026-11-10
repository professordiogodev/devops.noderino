import { appendFileSync } from "node:fs"
import { join } from "node:path"

export default {
  id: "observer",
  async setup(ctx) {
    const logFile = join(ctx.location.directory, "hook-log.txt")

    await ctx.tool.hook("execute.after", (event) => {
      try {
        appendFileSync(logFile, `AI used: ${event.tool}\n`)
      } catch (erro) {
        console.error(`observer: could not write ${logFile}:`, erro)
      }
    })
  },
}
