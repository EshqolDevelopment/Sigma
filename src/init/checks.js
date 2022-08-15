export function pythonCheck(code, function_name, input, output, multi) {
    return `
class Checker:
    def __init__(self, function, func_name, input_dict, output_dict, multi_arguments):
        self.function = function
        self.func_name = func_name
        self.multi_arguments = multi_arguments
        self.input_dict = input_dict
        self.output_dict = output_dict
        self.log = ""

    result = None

    def checks(self):
        d = {}

        if self.func_name == "string_product" and "int(" in self.function.replace(" ", ""):
            self.result = "You can't use the built in int() method"
            return "You can't use the built in int() method"

        if self.func_name == "nearest_multiple_of_10" and "round(" in self.function.replace(" ", ""):
            self.result = "You can't use the built in round() function"
            return "You can't use the built in round() function"

        if self.func_name == "correct_expression" and (
                "eval(" in self.function.replace(" ", "") or "exec(" in self.function.replace(" ", "")):
            self.result = "You can't use the built in eval() or exec() functions"
            return "You can't use the built in eval() or exec() functions"

        if self.func_name == "bigger_number" and (
                "<" in self.function.replace(" ", "") or ">" in self.function.replace(" ",
                                                                                      "") or "max" in self.function.replace(
                " ", "") or "min" in self.function.replace(" ", "") or "==" in self.function.replace(" ", "")):
            self.result = "You can't use the <, >, max, min and == signs."
            return "You can't use the <, >, max, min and == signs."

        if self.func_name == "palindrome_number" and "str(" in self.function.replace(" ", ""):
            self.result = "You can't use the built in str() method"
            return "You can't use the built in str() method"

        if "open" in self.function or "random" in self.function.replace(" ", ""):
            self.result = "access denied"
            return "access denied"


        exec(self.function, d)

        if self.func_name == "equals":
            if d[self.func_name]() == -43.5 and d[self.func_name]() == "gregio" and d[self.func_name]() == (lambda: 1) and d[self.func_name]() == [4, "534"]:
                self.result = True
                return True

        if "__eq__" in self.function:
            self.result = False
            return False

        if len(self.input_dict) == 0:
            if d[self.func_name]() != self.output_dict:
                self.result = False
                return False
            self.result = True
            return True

        if self.func_name in ["get_indexes", "triplet_sum_array", "area_of_triangle", "minimize_the_sum",
                              "count_solution", "add_binary", "string_product",
                              "queen_attack"] or self.multi_arguments == "true":
            for i in range(len(self.input_dict)):
                inp = self.input_dict[i]
                if d[self.func_name](*inp) != self.output_dict[i]:
                    self.result = False
                    return False
            self.result = True
            return True

        elif str(self.input_dict)[2] == '<' and str(self.input_dict)[-3] == '>':
            z = self.input_dict
            for i in range(len(z)):
                arguments = str(z[i])[1:-1].split(",")
                for x in range(len(arguments)):
                    if "'" not in arguments[x] and '"' not in arguments[x]:
                        if "." not in arguments[x]:
                            arguments[x] = int(arguments[x])
                        else:
                            arguments[x] = float(arguments[x])
                if d[self.func_name](*arguments) != self.output_dict[i]:
                    self.result = False
                    return False
            self.result = True
            return True

        else:
            for i in range(len(self.input_dict)):
                if d[self.func_name](self.input_dict[i]) != self.output_dict[i]:
                    self.result = False
                    return False
            self.result = True
            return True

    def get_result(self):
        if self.result is None:
            self.checks()
        if self.result == False and self.log != "":
            return "Incorrect Answer\\\\nPrints: " + self.log
        if self.result is False:
            return False
        return self.result

def get_winner(checker1, checker2):
    check1 = checker1.get_result()
    check2 = checker2.get_result()
    if check1 and not checker2.get_result():
        return "player1"
    elif check2 and not check1:
        return "player2"
    elif check2 and check1:
        return "toe right"
    else:
        return "toe wrong"

def main(function, func_name, input_dict, output_dict, multi_arguments):
    try:
        player = Checker(function, func_name, input_dict, output_dict, multi_arguments)
        res = player.get_result()
        if res is False:
            return "Incorrect Answer"
        return str(res)
    except Exception as e:
        return str(e)

main("""${code}""", "${function_name}", ${input}, ${output}, "${multi}")`
}

