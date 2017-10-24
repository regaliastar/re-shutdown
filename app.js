/**
 * node app 5	--System will shutdown 5 minutes later
 * node app quit    --Quit system shutdown
 */

var cmd = require('node-cmd');
var program = require('commander');

program
	.version('1.0.0')
	.description('自动关机脚本')
	.parse(process.argv);

var shutdownCommand = {

	exec : function(){
		var minutes = program.args[0] * 60;

		cmd.get(
        	'shutdown -s -t '+minutes,
        	function(err, data, stderr){
            	console.log(data+'命令成功执行, 系统于 '+program.args[0]+' 分钟后关机');
        	}
    	);

   		cmd.run('touch example.created.file');
	}

}

var quitShutdownCommand = {

	exec: function(){
		cmd.get(
        	'shutdown -a',
        	function(err, data, stderr){
            	console.log(data+'成功取消关机任务');
       		}
    	);

    	cmd.run('touch example.created.file');
	}

}

var MacroCommand = function(){

	return {
		commandList: [],

		add: function(command){
			this.commandList.push(command);
		},

		undo: function(){	//撤销功能

		},

		execute: function(){
			for(let i in this.commandList){
				this.commandList[i].exec();
			}
		}
	}

}

var macroCommand = MacroCommand();

if(!isNaN(program.args[0])){	//若输入为数字

	macroCommand.add(shutdownCommand);

}else if(program.args[0] === 'q' || program.args[0] === 'quit'){

	macroCommand.add(quitShutdownCommand);

}

macroCommand.execute();