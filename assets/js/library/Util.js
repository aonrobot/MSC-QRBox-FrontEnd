export default class Util{
    static capacityUnit(value, i = 0){
        value = (value < 1000) ? value : value / 1000;
        if(value >= 1000){
            return this.capacityUnit(value, ++i)
        }else{
            i++
            return value.toFixed(2) + ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', '', '', ''][i]
        }
    }
}