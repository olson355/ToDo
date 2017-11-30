import { inject } from 'aurelia-framework';
import { ToDos } from '../resources/data/todos';
import { Router } from 'aurelia-router';
import {AuthService} from 'aurelia-auth';

@inject(ToDos, AuthService, Router)
export class List {
	constructor(todos, auth, router) {
		this.router = router;
		this.todos = todos
		this.auth = auth
		this.user = JSON.parse(sessionStorage.getItem('user'));
		this.showList = true;
		this.showCompleted = false;
		this.priorities = ['Low', 'Medium', 'High', 'Critical'];
	}

	async activate() {
		await this.todos.getUserTodos(this.user._id);
	}

	editTodo(todo) {
		this.todoObj = todo;
		this.showList = false;
	}


	createTodo() {
		this.todoObj = {
			todo: "",
			description: "",
			dateDue: new Date(),
			userId: this.user._id,
			priority: this.priorities[0]
		}
		this.showList = false;
	}

	async saveTodo() {
		if (this.todoObj) {
			let response = await this.todos.save(this.todoObj);
			if (response.error) {
				alert("There was an error creating the ToDo");
			} else {
				var todoId = response._id;
				if (this.filesToUpload && this.filesToUpload.length) {
					await this.todos.uploadFile(this.filesToUpload, this.user._id, todoId);
					this.filesToUpload = [];
				}								
			}
			this.showList = true;
		}
	}
	deleteTodo(todo) {
		this.todos.deleteTodo(todo._id);
	}

	completeTodo(todo) {
		todo.completed = !todo.completed;
		this.todoObj = todo;
		this.saveTodo();
	}

	toggleShowCompleted() {
		this.showCompleted = !this.showCompleted;
	}

	changeFiles() {
		this.filesToUpload = new Array();
		this.filesToUpload.push(this.files[0]);
	}
	removeFile(index) {
		this.filesToUpload.splice(index, 1);
	}

	logout() {
		sessionStorage.removeItem('user');
		this.auth.logout();
	}

}
