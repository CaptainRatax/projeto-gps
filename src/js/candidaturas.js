$(() => {
    getCandidaturasAbertas();
})

function getCandidaturasAbertas() {
    $.get("http://localhost:3000/api/universidades/candidaturasAbertas", (data) => {
        if (data.length == 0) {
            $('#exampleModal').modal('show');
        }
    })

}