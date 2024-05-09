<?php

namespace App\Controller;

use App\Repository\MovieRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

use Symfony\Component\HttpFoundation\Request;

class MoviesController extends AbstractController
{
    public function __construct(
        private MovieRepository $movieRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/movies', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {   
        // ottengo il parametro orderByYear 
        $orderByYear = $request->query->get('orderByYear');

        // Verifica se il valore di orderByYear è valido, se non è valido lo imposto ASC
        if ($orderByYear !== "ASC" && $orderByYear !== "DESC") {
            
            $orderByYear = "ASC";
        }

    $movies = $this->movieRepository->findOrderedByYear($orderByYear);
    $data = $this->serializer->serialize($movies, "json", ["groups" => "default"]);

    return new JsonResponse($data, json: true);
    }
}
