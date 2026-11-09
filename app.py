from flask import Flask, render_template, request, jsonify
import ast
import operator
import math

app = Flask(__name__)

# Only these arithmetic operations are permitted. No Python eval() is used.
OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
}

def safe_calculate(expression: str):
    """Evaluate a basic arithmetic expression using a strict AST allow-list."""
    if not isinstance(expression, str) or not expression.strip():
        raise ValueError("Enter an expression first.")
    if len(expression) > 200:
        raise ValueError("Expression is too long.")

    try:
        tree = ast.parse(expression, mode="eval")
    except SyntaxError:
        raise ValueError("Invalid mathematical expression.")

    def visit(node):
        if isinstance(node, ast.Expression):
            return visit(node.body)
        if isinstance(node, ast.Constant) and type(node.value) in (int, float):
            return node.value
        if isinstance(node, ast.BinOp) and type(node.op) in OPERATORS:
            left, right = visit(node.left), visit(node.right)
            if isinstance(node.op, ast.Pow) and abs(right) > 100:
                raise ValueError("Exponent is too large.")
            result = OPERATORS[type(node.op)](left, right)
            if isinstance(result, complex) or not math.isfinite(float(result)):
                raise ValueError("Result is outside the supported range.")
            return result
        if isinstance(node, ast.UnaryOp) and type(node.op) in OPERATORS:
            return OPERATORS[type(node.op)](visit(node.operand))
        raise ValueError("Only numbers, parentheses, and + - * / % ** are allowed.")

    try:
        result = visit(tree)
    except ZeroDivisionError:
        raise ValueError("Cannot divide by zero.")
    except OverflowError:
        raise ValueError("Result is too large.")

    if isinstance(result, float):
        result = round(result, 10)
        if result.is_integer():
            result = int(result)
    return result


@app.get("/")
def home():
    return render_template("index.html")


@app.post("/api/calculate")
def calculate():
    data = request.get_json(silent=True) or {}
    expression = data.get("expression", "")
    try:
        result = safe_calculate(expression)
        return jsonify({"success": True, "expression": expression, "result": result})
    except (ValueError, TypeError) as error:
        return jsonify({"success": False, "error": str(error)}), 400


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "message": "Calculator API is running"})


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
