declare module "Parser/Libs/GuiModule.dll" {
    type DialogType = number;
    /**
     * onChange - возникает при изменении значения в поле ввода.
     */
    type Events = 'onChange';

    /** поле для ввода строки */
    const TYPE_STRING: DialogType;
    /** поле для ввода даты */
    const TYPE_DATE: DialogType;
    /** поле для ввода времени */
    const TYPE_TIME: DialogType;
    /** поле для ввода числа с плавающей запятой */
    const TYPE_REAL: DialogType;
    /** поле для ввода логического значения */
    const TYPE_BOOL: DialogType;
    /** поле для ввода целочисленного значения */
    const TYPE_INT: DialogType; 

    class InputDialog {
        /** Создание поле для ввода и привязка его к диалогу */
        makeCombo(): Combo;
        /** Создание поле для ввода и привязка его к диалогу */
        makeInput(type: DialogType): Input;
        /** Показать созданный диалог */
        show(): void;    
    }

    interface Input {
        /** манипуляция с значением поля */
        value: string;
        /** манипуляция с названием поля */
        label: string;
        /** манипулияция с типо поля */
        type: DialogType;
        /** 
         * Манипуляция с модификатором только чтение
         * Default: false
         */
        isReadOnly: boolean;
        /** 
         * Манипуляция с модификатором не пустое
         * Default: true
         */
        isNotNull: boolean;
        /**
         * Добавление обработчика на заданное событие
         * @param name 
         * @param callback В качестве callback функции принимается функция следующей сигнатуры: function(text) { //... }, где text - текущее значение поля ввода.
         */
        addHandler(name: Events, callback: (value: string) => void): void;
    
    }

    interface Combo extends Input {
        /** Добавление текстового значения в выпадающий список */
        addValue(value: string): void;
        /** Принудительная установка значений выпадающего списка. Все предыдущие значения стираются */
        setValues(values: string[]): void;
        /** Очистка элементов выпадающего списка */
        clear(): void;
        /** порядковый номер выбранного на данный момент элемента */
        selectionIdx: number;
    }
}
declare class Query {
    constructor(query: string);
    exec(): boolean;
    open(): void;
    next(): void;
    close(): void;

    eof: boolean; // todo
    recCount: number;
    fldsCount: number;
    getFieldInfo(index: number): {
        name: string;
        isNullable: boolean;
        type: string; // todo
    };
    //#region set
    /**
     * Универсальный метод для получения значения
     * @param number Номер поля
     */
    get(number: number): number | boolean | Date | string;
    /**
     * Получение значения в целочисленном виде
     * @param index Номер поля
     */
    getInt(index: number): number;
    /**
     * Получение значения в виде дробного числа
     * @param index Номер поля
     */
    getDouble(index: number): number;
    /**
     * Получение значения в виде логического флага
     * @param index Номер поля
     */
    getBool(index: number): boolean;
    /**
     * Получение значения в виде строки
     * @param index Номер поля
     */
    getString(index: number): string;
    /**
     * Получение значения в виде даты
     * @param index Номер поля
     */
    getDate(index: number): Date;
    //#endregion
    // #region set
    /**
     * Установка любого по типу параметра
     * @param index Номер поля
     * @param value Значение поля
     */
    setParam(index: number, value: any): boolean;
    /**
     * Установка целочисленного параметра
     * @param index Номер поля
     * @param value Значение поля
     */
    setInt(index: number, value: number): boolean;
    /**
     * Установка дробного параметра
     * @param index Номер поля
     * @param value Значение поля
     */
    setDouble(index: number, value: number): boolean;
    /**
     * Установка логического параметра
     * @param index Номер поля
     * @param value Значение поля
     */
    setBool(index: number, value: boolean): boolean;
    /**
     * Установка строкового параметра
     * @param index Номер поля
     * @param value Значение поля
     */
    setString(index: number, value: string): boolean;
    /**
     * Установка даты или времени (использовать Date.UTC(...)).
     * @param index Номер поля
     * @param value Значение поля
     */
    setDate(index: number, value: number): boolean;
    //#endregion
}
declare namespace Fs {
    type OpenFileMode = number;

    /** Режим записи */
    const WRITE_MODE: OpenFileMode;
    /** Режим чтения */
    const READ_MODE: OpenFileMode;
    /** Режим дополнения */
    const APPEND_MODE: OpenFileMode;
}

declare class File {
    constructor(name: string, mode: Fs.OpenFileMode)

    eof: boolean;
    readLine(): string;
    readAll(): string;
    write(text: string): void;
    close(): void;
}
declare namespace MsgBox {
    function show(text: string, title: string): void;
}
declare function print(...value: any): void;
  
declare interface DateConstructor {
    fromString(date: string): Date;
}
declare namespace Session {
    /**
     * Возвращает Id текущего пользователя
     */
    function userId(): number;
}
