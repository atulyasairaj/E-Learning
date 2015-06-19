#include<stdio.h>
#include<string.h>

void main(){
	FILE *f1,*f2;

	f1 = fopen("input.txt", "r");
	f2 = fopen("output.txt", "w");

	char temp[30];

	int count = 0;

	while(!feof(f1)){
		fscanf(f1,"%s", temp);

		if(strstr(temp, "<ul>") != NULL){
			while(1){
				fscanf(f1,"%s", temp);
				if(strstr(temp,"<li>")!=NULL)
					count++;
				if(strstr(temp, "</ul>") !=NULL){
					break;				
				}
				
			}

		}
		fprintf(f2, "%d", count);
	}

	fclose(f1);

	fclose(f2);
}