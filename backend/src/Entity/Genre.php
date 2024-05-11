<?php

namespace App\Entity;


use App\Repository\MovieRepository;
use App\Repository\GenreRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;


#[ORM\Entity(repositoryClass: GenreRepository::class)]
#[ORM\Table('genres')]
class Genre
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['default'])] 
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['default'])] 
    private ?string $name = null;

    #[ORM\ManyToMany(targetEntity: "App\Entity\Movie", mappedBy: "genres")]
    #[Groups(['default'])]
    private Collection $movies;

    public function __construct()
    {
        $this->movies = new ArrayCollection();
    }

    /**
     * @return Collection|Movie[]
     */
    public function getMovies(): Collection
    {
        return $this->movies;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

}


