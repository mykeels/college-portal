# Entity List

* School
* Faculty
* Department
* Group
* User
	* Staff
	* Student
	* Admin
* Role
* Action
* Course
* Assets
* Grade
* Event
	* Semester
	* Session
	* Semester-Registration


## School
A School represents the higher institution making use of the proposed software. 
It could be a University, College or Polytechnic. There can only be one School 
making use of an instance of the software at any time.

| Name 					| Type    | Description					    |
|-----------------------|---------|---------------------------------|
| Name 					| string  |	Name of the School   			|
| Logo					| string  | School Logo          		    |
| Address       		| string  |	Address location of the school	|


## Faculty
A Faculty is a division within a School comprising one subject area, 
or a number of related subject areas.

| Name 				| Type    | Description							   |
|-------------------|---------|----------------------------------------|
| Id			    | number  |	Faculty ID							   |
| Name				| string  | Name of the Faculty    		           |
| Dean       		| number  | Staff ID							   |
| Department		| array	  |	List of departments under each faculty |

## Department
A Department is a division within a Faculty comprising one subject area,
 or a number of related subject areas.

| Name 			| Type    | Description			    |
|---------------|---------|-------------------------|
| 	Id			| number  |	Department ID			|
|	Name		| string  | Name of the Department  |
|   HOD    		| number  |	Staff ID			    |

## Group
Groups are registered organisations, associations and communities within the School. 
They can range from student study groups to student unions.

| Name 				| Type    | Description 		|
|-------------------|---------|---------------------|
| Id				| number  | ID					|
| Name				| string  | Name of the Group            		|
| Description       | string  | Description of the Group	|
| Creator Id		| number  |	staff or Student ID	|


## Staff
Staff are employed by the School. They may be teaching or non-teaching staff. 
A staff may also take on one or more roles within the School. E.g. 
A teaching staff might be a Lecturer and HOD, or a non-teaching staff be 
the Registrar or Bursar.

| Name 				| Type    | Description |
|-------------------|---------|-------------|
|  Id				| name		  |	Staff ID			|
|	Name				| string        | Name of the Staff            |
|   Title     			| string       | Mr, Mrs, Dr, etc				|
|	Roles				| array		  | Staff Roles is a collection of Role IDs		|


## Student
Students are individuals who are registered to take part in academic activities for 

learning purposes. A student may also take on roles or responsibilities such as lead or 
participate in a Group.

| Name 				| Type    | Description |
|-------------------|---------|-------------|
| Id				| number		  |	Student ID			|
| Names					| string         | Name of the Student             |
| Roles       			| array        | Student Roles is a collection of Role IDs			|

## Admin
The Admin is the first User of the system. He/She is responsible for creating and starting 
the school system, managing user accounts and keeping the system running.

| Name 				| Type    | Description |
|-------------------|---------|-------------|
| Id				| number		  |	Admin ID	|
| Password			| string       | Secret            |

## Role
A Role is a tag or label that means a User is able to define a set of Actions defined within
 the Role. E.g. the HOD Role means that a Staff can approve results on behalf of a department
  he/she is the HOD of.

| Name 				| Type    | Description |
|-------------------|---------|-------------|
| Id				| number		  |	Role Id			|
| Name				| string        | Role Name            |
| Action       		| array       |	List of Actions		|


## Action
An Action is an entity that represents an actual task can be performed by a User within the 
system. Actions are usually bound to Roles, which can then be assigned to a User.

| Name 				| Type    | Description |
|-------------------|---------|-------------|
|   Id				| number		  |	Action ID			|
|	Name				| string        | Action Name            |
|    Description    			| string        | Shows what a user with a role bearing this action can do				|

## Course
A Course represents a Subject that students can subscribe to, learn and receive Grades for having learnt.

| Name 				| Type    | Description |
|-------------------|---------|-------------|
| Id 				| number		  |	Course ID			|
| Code					| string        | Course Code e.g. MATH 101             |
| Description   			| string        | Text, showing what the course is about		|
| Dependencies			|array		  |	List of courses the student is expected to have 
passed before registering this course			|

## Assets
Assets are property, access-rights and privileges a student or staff can be granted access
 to at any point in time. Some assets are free while others are paid. E.g. Tuition, Library 
 access, Laboratory access, etc.

Paid assets are accumulated to generate semester charges.

| Name 				| Type    | Description |
|-------------------|---------|-------------|
|  Id 				|	number	  |	Asset ID			|
|  Name					|  String       | Asset Name             |
|  Creator Id  			|  number       |The Id of the User that created the asset				|
|  Charges					| number		  |	The cost of the asset on any user who bears it	|

## Grade
A grade is a partial or total score a lecturer assigns to a student who takes a course he/she
 is in charge of. We introduced partial grade system, because the grading is done progressively. 
 E.g. Assignment, Quiz, Mid-semester tests, etc. 

Every Time a grade is added by the lecturer, a reasons must be given.

Grades can also be retracted and reasons must be given for why.

| Name 				| Type    | Description |
|-------------------|---------|-------------|
| Id			    | number	  | Grade ID				|
| StudentId					| number       | The Id of the Student             |
| StaffId      			| number       | The Id of the Student				|
| CourseId					| number		  |	The Id of the Course the student gets the grade in
			|
| Score					| number		  |	+/- number representing the score added or retracted	|
| Description					| string		  |	The explanation the lecturer gives for the grade
 e.g. “Assignment”, “Quiz”, etc			|




## Event
A Event happens at a particular time period. Any user of the system can create an event 
and add users to it. Events can be postponed and cancelled.

| Name 				| Type    | Description |
|-------------------|---------|-------------|
| Id   				|number	  |Event ID		|
| Creator ID		|number   |The ID of the Student or Staff Creator             |
| CreatedDate       | datetime        |	The Date the Event was created			|
| StartDate					|datetime		  |	The Date the Event is supposed to start			|
| End Date					|datetime		  |	The Date the Event is supposed to end			|
| Description					|string		  |	The Reason for the Event			|

### Semester
A Semester is a special kind of Event. It has a start date, and end date and is created
 by a staff of the school. It is the time period within when school activities take place.

### Semester Registration

### Session
