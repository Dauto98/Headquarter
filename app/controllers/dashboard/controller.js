const path = require('path');
const exec = require('child_process').exec;

module.exports = {
	execShell : (req, res) => {
		console.log(req.body.script);
		const child = exec(req.body.script, {cwd : path.resolve(__dirname, "../../../")}, (error, stdout, stderr) => {
			if (error) {
				// console.log("error: " + error);
				// console.log("stderr: " + stderr);
				res.json({
					status : 0,
					error : error
				})
			} else {
				// console.log("stdout: " + stdout);
				res.json({
					status : 1,
					result : stdout
				})
			}
		})
	}
}
