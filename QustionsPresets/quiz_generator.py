import os
import json
import codecs

def menu():
    os.system('@echo off')
    os.system('cls')
    print(('=' * 10) +'QUIZ GENERATOR' + ('=' * 10))
    print('Выберите действие:\n')
    print('qf - собрать список вопросов из текстового документа')
    print('h - показать правила форматирования для интерпритатора qf')
    print('e - выйти')

    action = input('>> ')
    if(action == 'qf'):
        interFile()
    elif (action == 'h'):
        print('category|question|hard|right|img(empty in dont needed)|ansver0|ansver1|...|answerN')
        input()
        menu()
    elif(action == 'e'):
        os.system('exit')


def interFile():
    os.system('@echo off')
    os.system('cls')
    print('QF Manager')
    obj = []
    body = []
    file = input('Выбертите файл : ')
    with open(file , 'r' , encoding='utf-8') as f:
        lines = f.readlines()
        
        for line in lines:
            jsonB = {}
            data = line.split('|')
            if(len(data) < 5):
                print("Не верный формат строки, она содержит не допустимое колличество параметров")    
                return
            jsonB['answers'] = []
            for answer in range(5 , len(data)):
                jsonB['answers'].append(data[answer])
            jsonB['question'] = data[1]
            jsonB['hard'] = int(data[2])
            jsonB['right'] = int(data[3])
            jsonB['img'] = data[4]
            
            isEmptyCategory = True
            index = 0
            for i in range(len(body)):
                if(body[i]['category'] == data[0]):
                    isEmptyCategory = False
                    index = i
                    break
            if isEmptyCategory:
                body.append({'category':data[0] , 'questions': [jsonB]})
            else:
                body[index]['questions'].append(jsonB)
    d = file.split('.')
    base= d[0]+"-result.txt"
    file = input("Сохранить в ("+base+") : ")
    if file == '':
        file = base
    with open(file , 'w', encoding='utf-8') as f:
        f.write(json.dumps(body , ensure_ascii=False).replace('\\n' , ''))
    input()
    menu()


if __name__ == '__main__':
    menu()
